import { Plugin, TFile } from 'obsidian';
import { TaskIndex } from './task-index.ts';
import { TaskView, TASK_VIEW_TYPE } from './task-view.ts';

export default class RjmTasksPlugin extends Plugin {
  private index!: TaskIndex;

  async onload(): Promise<void> {
    this.index = new TaskIndex(this.app.vault);
    this.registerView(TASK_VIEW_TYPE, (leaf) => new TaskView(leaf, this.index));
    this.addCommand({
      id: 'open-task-list',
      name: '打开任务列表',
      callback: () => { void this.openTaskList(); },
    });

    this.registerEvent(this.app.vault.on('create', (file) => {
      if (file instanceof TFile) void this.index.refreshFile(file);
    }));
    this.registerEvent(this.app.vault.on('modify', (file) => {
      if (file instanceof TFile) void this.index.refreshFile(file);
    }));
    this.registerEvent(this.app.vault.on('delete', (file) => {
      this.index.removeFile(file.path);
    }));
    this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
      this.index.removeFile(oldPath);
      if (file instanceof TFile) void this.index.refreshFile(file);
    }));

    this.app.workspace.onLayoutReady(() => { void this.index.refreshAll(); });
  }

  async onunload(): Promise<void> {
    this.app.workspace.detachLeavesOfType(TASK_VIEW_TYPE);
  }

  private async openTaskList(): Promise<void> {
    let leaf = this.app.workspace.getLeavesOfType(TASK_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false) ?? undefined;
      if (!leaf) return;
      await leaf.setViewState({ type: TASK_VIEW_TYPE, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
  }
}
