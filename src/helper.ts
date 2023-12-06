import {
  CachedMetadata,
  EditorPosition,
  FrontMatterCache,
  Loc,
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

const toEditorPosition = (loc: Omit<Loc, "offset">): EditorPosition => ({
  ch: loc.col,
  line: loc.line,
});

export function exists(path: string): Promise<boolean> {
  return app.vault.adapter.exists(path);
}

export const getActiveFile = (): TFile => app.workspace.getActiveFile()!;

export function getActiveFileCache(): CachedMetadata | null {
  return app.metadataCache.getFileCache(getActiveFile());
}

export function getMarkdownFiles(): TFile[] {
  return app.vault.getMarkdownFiles();
}

export function getFileMap(): { [path: string]: TFile } {
  return app.vault.fileMap;
}

export function getFileByPath(path: string): TFile | null {
  const abstractFile = app.vault.getAbstractFileByPath(path);
  if (!abstractFile) {
    return null;
  }

  return abstractFile as TFile;
}

export function getFileCacheByPath(path: string): CachedMetadata | null {
  const f = getFileByPath(path);
  if (!f) {
    return null;
  }
  return app.metadataCache.getFileCache(f);
}

export const getFrontmatterByPath = (path: string): FrontMatterCache | null =>
  getFileCacheByPath(path)?.frontmatter ?? null;

export const getActiveFileFrontmatter = (): FrontMatterCache | null =>
  getActiveFileCache()?.frontmatter ?? null;

export const getCodeBlockSectionsByPath = (path: string): SectionCache[] =>
  getFileCacheByPath(path)?.sections?.filter((x) => x.type === "code") ?? [];

export const getActiveEditor = (): UEditor =>
  app.workspace.activeEditor?.editor!;

export const getActiveMetadataEditor = (): UMetadataEditor =>
  (app.workspace.activeEditor as any).metadataEditor!;

export function getActiveLine(): string {
  const editor = getActiveEditor();
  return editor.getLine(editor.getCursor().line);
}

export function getBacklinksByFilePathInActiveFile(): {
  [path: string]: ULinkCache[];
} {
  return app.metadataCache.getBacklinksForFile(getActiveFile()).data;
}

export function getSelection(): string {
  return getActiveEditor().getSelection();
}

export async function loadFileContent(
  path: string,
  position?: {
    start: Pick<Loc, "offset">;
    end: Pick<Loc, "offset">;
  }
): Promise<string | null> {
  const f = getFileByPath(path);
  if (!f) {
    return null;
  }

  const text = await app.vault.cachedRead(f);
  return position
    ? text.slice(position.start.offset, position.end.offset)
    : text;
}

export function getActiveFileContent(position?: {
  start: Omit<Loc, "offset">;
  end: Omit<Loc, "offset">;
}): string {
  const editor = getActiveEditor();

  if (!position) {
    return editor.getValue();
  }

  return editor.getRange(
    toEditorPosition(position.start),
    toEditorPosition(position.end)
  );
}

export function setSelection(text: string): void {
  getActiveEditor().replaceSelection(text);
}

export function deleteActiveLine(): void {
  const editor = getActiveEditor();
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
  const { line, ch } = editor.getCursor();
  editor.setLine(line, str);

  // XXX: lastのときは最後の空白手前で止まってしまうので-1を消す
  const afterCh =
    option?.cursor === "last" ? str.length : Math.min(ch, str.length - 1);

  editor.setCursor({ line, ch: afterCh });
}

export function appendLine(str: string): void {
  const editor = getActiveEditor();
  editor.replaceRange(`\n${str}`, { line: editor.lastLine() + 1, ch: 0 });
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

export function usePeriodicNotesSettings(): UApp["plugins"]["plugins"]["periodic-notes"] {
  return app.plugins.plugins["periodic-notes"];
}

export async function getObsidianPublishHost(): Promise<string> {
  return app.internalPlugins.plugins["publish"].instance
    .apiCustomUrl()
    .then((x: any) => x.url);
}

export function createFile(path: string, data: string = ""): Promise<TFile> {
  return app.vault.create(path, data);
}

export function openFile(
  path: string,
  option?: { newLeaf: boolean }
): Promise<void> {
  const newLeaf = option?.newLeaf ?? false;
  return app.workspace.openLinkText("", path, newLeaf);
}
