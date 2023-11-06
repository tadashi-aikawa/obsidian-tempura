import {
  CachedMetadata,
  EditorPosition,
  FrontMatterCache,
  Loc,
  Pos,
  SectionCache,
  TFile,
} from "obsidian";
import {
  Moment,
  MomentInput,
  UApp,
  UEditor,
  ULinkCache,
  UMetadataEditor,
  UTemplater,
} from "./types";

declare let app: UApp;

declare function moment(inp?: MomentInput, strict?: boolean): Moment;

declare class Notice {
  // If duration is undefined, it is treated as 5000.
  constructor(message: string | DocumentFragment, duration?: number | null);
}

const locToEditorPosition = (loc: Loc): EditorPosition => ({
  ch: loc.col,
  line: loc.line,
});

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

export const getActiveFileCodeBlockSections = (): SectionCache[] =>
  getActiveFileCache()?.sections?.filter((x) => x.type === "code") ?? [];

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

export function getActiveFileContent(pos?: Pos): string | null {
  const editor = getActiveEditor();
  if (!editor) {
    return null;
  }

  if (!pos) {
    return editor.getValue();
  }

  return editor.getRange(
    locToEditorPosition(pos.start),
    locToEditorPosition(pos.end)
  );
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

export function useTemplaterInternalFunction(): UTemplater {
  return app.plugins.plugins["templater-obsidian"].templater
    .current_functions_object as UTemplater;
}
