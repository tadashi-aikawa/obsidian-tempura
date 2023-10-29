import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import {
  Moment,
  MomentInput,
  UApp,
  UEditor,
  ULinkCache,
  UMetadataEditor,
} from "./types";

declare let app: UApp;

declare function moment(inp?: MomentInput, strict?: boolean): Moment;

declare class Notice {
  // If duration is undefined, it is treated as 5000.
  constructor(message: string | DocumentFragment, duration?: number | null);
}

export const getActiveFile = (): TFile | null => app.workspace.getActiveFile();

export function getActiveFileCache(): CachedMetadata | null {
  const f = getActiveFile();
  if (!f) {
    return null;
  }
  return app.metadataCache.getFileCache(f);
}

export const getActiveFileFrontmatter = (): FrontMatterCache | null =>
  getActiveFileCache()?.frontmatter ?? null;

export const getActiveEditor = (): UEditor | null =>
  app.workspace.activeEditor?.editor ?? null;

export const getActiveMetadataEditor = (): UMetadataEditor | null =>
  (app.workspace.activeEditor as any).metadataEditor ?? null;

export function getActiveLine(): string | null {
  const editor = getActiveEditor();
  if (!editor) {
    return null;
  }

  return editor.getLine(editor.getCursor().line);
}

export function getBacklinksByFilePathInActiveFile(): {
  [path: string]: ULinkCache[];
} | null {
  const f = getActiveFile();
  if (!f) {
    return null;
  }

  return app.metadataCache.getBacklinksForFile(f).data;
}

export function getSelection(): string | null {
  const editor = getActiveEditor();
  if (!editor) {
    return null;
  }

  return editor.getSelection();
}

export function setSelection(text: string): void {
  const editor = getActiveEditor();
  if (!editor) {
    return;
  }

  editor.replaceSelection(text);
}

export function deleteActiveLine(): void {
  const editor = getActiveEditor();
  if (!editor) {
    return;
  }

  const cur = editor.getCursor();
  if (cur.line === editor.lastLine()) {
    editor.setLine(cur.line, "");
  } else {
    editor.replaceRange(
      "",
      { line: cur.line, ch: 0 },
      {
        line: cur.line + 1,
        ch: 0,
      }
    );
  }
}

export function replaceStringInActiveLine(
  str: string,
  option?: { cursor?: "last" }
): void {
  const editor = getActiveEditor();
  if (!editor) {
    return;
  }

  const { line, ch } = editor.getCursor();
  editor.setLine(line, str);

  // XXX: lastのときは最後の空白手前で止まってしまうので-1を消す
  const afterCh =
    option?.cursor === "last" ? str.length : Math.min(ch, str.length - 1);

  editor.setCursor({ line, ch: afterCh });
}

export function notify(text: string | DocumentFragment, timeoutMs?: number) {
  new Notice(text, timeoutMs ?? null);
}

export function createMoment(input?: MomentInput): Moment {
  return moment(input);
}
