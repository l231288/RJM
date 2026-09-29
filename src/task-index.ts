import type { TFile, Vault } from 'obsidian';
import { parseTasks } from './task-parser.ts';
import type { Task } from './types.ts';

export class TaskIndex {
  private readonly vault: Vault;
  private readonly byPath = new Map<string, Task[]>();
  private readonly revisions = new Map<string, number>();
  private readonly listeners = new Set<() => void>();

  constructor(vault: Vault) {
    this.vault = vault;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getOpenTasks(): Task[] {
    return [...this.byPath.values()]
      .flat()
      .filter((task) => !task.completed)
      .sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line);
  }

  async refreshAll(): Promise<void> {
    await Promise.all(this.vault.getMarkdownFiles().map((file) => this.refreshFile(file)));
  }

  async refreshFile(file: TFile): Promise<void> {
    if (file.extension !== 'md') return;
    const path = file.path;
    const revision = (this.revisions.get(path) ?? 0) + 1;
    this.revisions.set(path, revision);
    try {
      const content = await this.vault.cachedRead(file);
      if (this.revisions.get(path) !== revision) return;
      this.byPath.set(path, parseTasks(path, content));
      this.notify();
    } catch (error) {
      console.error(`RJM Tasks: could not read ${path}`, error);
    }
  }

  removeFile(path: string): void {
    this.revisions.set(path, (this.revisions.get(path) ?? 0) + 1);
    if (this.byPath.delete(path)) this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}
