import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTasks } from '../src/task-parser.ts';

test('extracts open and completed dash tasks with original line numbers', () => {
  const markdown = [
    '# Note',
    '- [ ] First task',
    '  - [x] Finished',
    '- [ ]',
    '* [ ] Not in the chosen syntax',
    '```md',
    '- [ ] Example only',
    '```',
    '- [ ] Last task',
  ].join('\n');

  assert.deepEqual(parseTasks('note.md', markdown), [
    { path: 'note.md', line: 1, text: 'First task', completed: false },
    { path: 'note.md', line: 2, text: 'Finished', completed: true },
    { path: 'note.md', line: 8, text: 'Last task', completed: false },
  ]);
});

test('supports CRLF and ignores fenced examples with longer closing fences', () => {
  const markdown = '~~~text\r\n- [ ] Hidden\r\n~~~~\r\n- [ ] Visible\r\n';
  assert.deepEqual(parseTasks('tasks.md', markdown), [
    { path: 'tasks.md', line: 3, text: 'Visible', completed: false },
  ]);
});
