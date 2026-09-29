import type { Task } from './types.ts';

const TASK_LINE = /^[ \t]*-[ \t]+\[([ xX])\][ \t]+(.+?)\s*$/;
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;

/** Extract standard dash checkbox items without interpreting task metadata. */
export function parseTasks(path: string, markdown: string): Task[] {
  const tasks: Task[] = [];
  let fence: { marker: string; length: number } | undefined;

  markdown.split(/\r?\n/).forEach((sourceLine, line) => {
    const lineText = sourceLine.replace(/\r$/, '');
    const opening = lineText.match(FENCE_OPEN);

    if (fence) {
      const closing = new RegExp(`^ {0,3}${fence.marker}{${fence.length},}[ \\t]*$`);
      if (closing.test(lineText)) fence = undefined;
      return;
    }
    if (opening) {
      const sequence = opening[1]!;
      fence = { marker: sequence[0]!, length: sequence.length };
      return;
    }

    const match = lineText.match(TASK_LINE);
    if (!match) return;
    const taskText = match[2]!.trim();
    if (!taskText) return;
    tasks.push({
      path,
      line,
      text: taskText,
      completed: match[1]!.toLowerCase() === 'x',
    });
  });

  return tasks;
}
