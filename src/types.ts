export interface Task {
  path: string;
  /** Zero-based line number in the source Markdown file. */
  line: number;
  text: string;
  completed: boolean;
}
