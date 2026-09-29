import assert from 'node:assert/strict';
import test from 'node:test';
import type { TFile, Vault } from 'obsidian';
import { TaskIndex } from '../src/task-index.ts';

function fakeFile(path: string): TFile {
  return { path, extension: 'md' } as TFile;
}

test('refreshes changed files and removes deleted or renamed paths', async () => {
  const files = [fakeFile('a.md'), fakeFile('b.md')];
  const contents = new Map([
    ['a.md', '- [ ] Alpha'],
    ['b.md', '- [x] Finished\n- [ ] Beta'],
  ]);
  const vault = {
    getMarkdownFiles: () => files,
    cachedRead: async (file: TFile) => contents.get(file.path) ?? '',
  } as unknown as Vault;
  const index = new TaskIndex(vault);

  await index.refreshAll();
  assert.deepEqual(index.getOpenTasks().map((task) => task.text), ['Alpha', 'Beta']);

  contents.set('a.md', '- [x] Alpha');
  await index.refreshFile(files[0]!);
  assert.deepEqual(index.getOpenTasks().map((task) => task.text), ['Beta']);

  index.removeFile('b.md');
  assert.deepEqual(index.getOpenTasks(), []);
});

test('does not restore a removed file when an earlier read finishes late', async () => {
  let finishRead!: (content: string) => void;
  const vault = {
    getMarkdownFiles: () => [],
    cachedRead: () => new Promise<string>((resolve) => { finishRead = resolve; }),
  } as unknown as Vault;
  const index = new TaskIndex(vault);
  const pending = index.refreshFile(fakeFile('old.md'));

  index.removeFile('old.md');
  finishRead('- [ ] Stale task');
  await pending;
  assert.deepEqual(index.getOpenTasks(), []);
});
