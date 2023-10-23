import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { UApp, UEditor, UMetadataEditor } from "./types";

declare let app: UApp;

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
