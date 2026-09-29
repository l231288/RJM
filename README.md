# RJM Tasks

An initial, read-only Obsidian plugin for listing unfinished Markdown tasks across a vault. This is the implementation proposal for [issue #1](https://github.com/l231288/RJM/issues/1).

## First version

- Reads Markdown files in the vault and recognizes dash checkbox items such as `- [ ] Write draft` and `- [x] Done`. Indented items are supported.
- Shows unfinished items in a side view. Use the **打开任务列表** command to open it.
- Click an item to open its source note at the original line.
- Refreshes the list when Markdown notes are created, edited, deleted, or renamed.
- Does not edit notes or interpret dates, priorities, recurrence, or other plugins' task metadata. Task examples inside fenced code blocks are ignored.

## Development

Requires Node.js 22.18 or newer. Install dependencies with `pnpm install`, then run `pnpm build` and `pnpm test`. To try the plugin, copy `manifest.json` and the built `main.js` to `<vault>/.obsidian/plugins/rjm-obsidian-tasks/`, then enable it under Community plugins. For live rebuilding, run `pnpm dev` in that plugin directory.

## Status

This repository started empty. The issue has no description, so this first version follows the three choices confirmed in the conversation: standalone Obsidian plugin, standard checkbox tasks across the vault, and read-only browsing with source navigation.

## Organization research library

The complete 22-file [组织研究与成长](组织研究与成长/开始阅读.md) collection is included as a separate directory. It contains learning notes, blank practice templates, a clearly fictional example, two standalone HTML diagrams, and an XLSX diagnostic toolkit. The source collection has no verified real-department diagnosis or personnel records. The workbook copy committed here has its editor-name metadata removed; the original file was not changed.

To read the collection in Obsidian, open this repository as a vault and start at `组织研究与成长/开始阅读.md`. The plugin only lists notes containing `- [ ]` tasks; the collection itself is primarily reference material and templates.
