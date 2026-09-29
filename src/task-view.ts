import { ItemView, MarkdownView, Notice, TFile, type WorkspaceLeaf } from 'obsidian';
import type { TaskIndex } from './task-index.ts';
import type { Task } from './types.ts';

export const TASK_VIEW_TYPE = 'rjm-obsidian-tasks-view';

export class TaskView extends ItemView {
  private readonly index: TaskIndex;
  private unsubscribe?: () => void;

  constructor(leaf: WorkspaceLeaf, index: TaskIndex) {
    super(leaf);
    this.index = index;
  }

  getViewType(): string { return TASK_VIEW_TYPE; }
  getDisplayText(): string { return 'Tasks'; }
  getIcon(): string { return 'list-checks'; }

  async onOpen(): Promise<void> {
    this.unsubscribe = this.index.subscribe(() => this.render());
    this.render();
  }

  async onClose(): Promise<void> {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  private render(): void {
    const root = this.contentEl;
    root.empty();
    root.createEl('h3', { text: '未完成任务' });
    const tasks = this.index.getOpenTasks();
    if (tasks.length === 0) {
      root.createEl('p', { text: '没有未完成任务。' });
      return;
    }

    const list = root.createEl('ul');
    for (const task of tasks) {
      const item = list.createEl('li');
      const button = item.createEl('button', { text: task.text });
      button.setAttribute('type', 'button');
      button.addEventListener('click', () => { void this.openSource(task); });
      item.createEl('small', { text: ` ${task.path}:${task.line + 1}` });
    }
  }

  private async openSource(task: Task): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(task.path);
    if (!(file instanceof TFile)) {
      new Notice('源笔记已不存在。');
      return;
    }
    const leaf = this.app.workspace.getLeaf('tab');
    await leaf.openFile(file);
    const view = leaf.view;
    if (view instanceof MarkdownView) {
      view.editor.setCursor({ line: task.line, ch: 0 });
      view.editor.scrollIntoView(
        { from: { line: task.line, ch: 0 }, to: { line: task.line, ch: 0 } },
        true,
      );
    }
  }
}
