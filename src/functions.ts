import { FrontMatterCache, TFile } from "obsidian";
import { ExhaustiveError } from "./errors";
import * as helper from "./helper";
import { CodeBlock, Moment, UEditor, UMetadataEditor } from "./types";
import { orderBy } from "./utils/collections";
import {
  parseMarkdownList,
  parseTags,
  stripDecoration,
  stripLinks,
} from "./utils/parser";
import { getDatesInRange } from "./utils/dates";
import { isPresent } from "./utils/types";

/**
 * 短い呼び出し表現でプロパティを呼び出せます
 */
export function use(): {
  editor: UEditor | null;
  properties: FrontMatterCache | null;
  metadataEditor: UMetadataEditor | null;
} {
  return {
    editor: helper.getActiveEditor(),
    properties: helper.getActiveFileFrontmatter(),
    metadataEditor: helper.getActiveMetadataEditor(),
  };
}

/**
 * 現在ファイルにプロパティを追加します
 *
 * ```ts
 * addProperty("id", 100)
 * addProperty("favorites", ["apple", "orange"])
 * ```
 */
export function addProperty(key: string, value: any | any[]): void {
  helper.getActiveMetadataEditor().insertProperties({ [key]: value });
}

/**
 * 現在ファイルに複数のプロパティを追加します
 *
 * ```ts
 * addProperty({id: 100, favorites: ["apple", "orange"]})
 * ```
 */
export function addProperties(properties: {
  [key: string]: any | any[];
}): void {
  helper.getActiveMetadataEditor().insertProperties(properties);
}

/**
 * 現在ファイルのプロパティを取得します
 *
 * ```ts
 * getProperties().description
 * // 説明文
 * ```
 */
export function getProperties(): { [key: string]: any | any[] } | null {
  return helper.getActiveFileFrontmatter();
}

/**
 * 現在ファイルのプロパティを更新します
 *
 * /```ts
 * updateProperty("id", 200)
 * ```
 */
export function updateProperty(key: string, value: any | any[]): void {
  removeProperty(key);
  addProperty(key, value);
}

/**
 * 現在ファイルのプロパティを削除します
 *
 * ```ts
 * removeProperty("id")
 * ```
 */
export function removeProperty(key: string): void {
  helper.getActiveMetadataEditor().insertProperties({ [key]: null });
}

/**
 * 現在ファイルのtagsプロパティを取得します
 *
 * ```ts
 * readTagsFromProperty()
 * // ["id", "favorites"]
 * ```
 */
export function readTagsFromProperty(): string[] {
  return helper.getActiveFileFrontmatter()?.tags ?? [];
}

/**
 * 現在ファイルのaliasesプロパティを取得します
 *
 * ```ts
 * readAliasesFromProperty()
 * // ["obsidian", "オブシディアン"]
 * ```
 */
export function readAliasesFromProperty(): string[] {
  return helper.getActiveFileFrontmatter()?.aliases ?? [];
}

/**
 * 現在ファイルのプロパティにフォーカスをあてます
 *
 * ```ts
 * focusPropertyValue("id")
 * ```
 */
export function focusPropertyValue(key: string): void {
  helper.getActiveMetadataEditor().focusValue(key);
}

/**
 * カーソル位置にテキストを挿入します
 *
 * ```ts
 * await insert("hogehoge")
 * ```
 */
export async function insert(text: string): Promise<void> {
  const editor = helper.getActiveEditor();
  editor.replaceRange(text, editor.getCursor());
}

/**
 * 現在行のテキストを取得します
 *
 * ```ts
 * getActiveLine()
 * // active line contents
 * ```
 */
export function getActiveLine(): string {
  return helper.getActiveLine();
}

/**
 * 現在行を削除します
 *
 * ```ts
 * deleteActiveLine()
 * ```
 */
export function deleteActiveLine(): void {
  return helper.deleteActiveLine();
}

/**
 * 現在行に含まれるタグの一覧を取得します
 *
 * ```ts
 * getActiveLineTags()
 * // ["todo", "done"]
 * ```
 */
export function getActiveLineTags(): string[] {
  return parseTags(getActiveLine());
}

/**
 * 選択しているテキストを1行ずつ取得します
 *
 * ```ts
 * getSelectionLines()
 * // ["- one", "- two", "- three"]
 * getSelectionLines() // 未選択のとき
 * // [""]
 * ```
 */
export function getSelectionLines(): string[] | [""] {
  return helper.getSelection().split("\n");
}

/**
 * 選択範囲をテキストで置換します
 *
 * ```ts
 * setTextToSelection("after text")
 * ```
 */
export function setTextToSelection(text: string): void {
  helper.getActiveEditor()?.replaceSelection(text);
}

/**
 * 現在のファイルのコードブロックを取得します
 *
 * ```ts
 * await getCodeBlocks()
 * // [
 * //   {language: "typescript", content: "const hoge = 'huga'", pos: ...},
 * //   {language: "javascript", content: "var hoge = 'huga'", pos: ...},
 * // ]
 * ```
 */
export async function getCodeBlocks(): Promise<CodeBlock[]> {
  return getCodeBlocksFrom(helper.getActiveFile().path);
}

/**
 * パスで指定したファイルのコードブロックを取得します
 *
 * ```ts
 * await getCodeBlocksFrom("Notes/sample-code.md")
 * // [
 * //   {language: "typescript", content: "const hoge = 'huga'", pos: ...},
 * //   {language: "javascript", content: "var hoge = 'huga'", pos: ...},
 * // ]
 * ```
 */
export async function getCodeBlocksFrom(path: string): Promise<CodeBlock[]> {
  const sections = helper.getCodeBlockSectionsByPath(path);

  const blocks = [];
  for (const section of sections) {
    const blockStr = (await helper.loadFileContent(path, section.position))!;
    const language =
      blockStr.match(/[`~]{3,}(?<language>[^ \n]*)/)?.groups?.language || null;
    blocks.push({
      language,
      content: blockStr.split("\n").slice(1).slice(0, -1).join("\n"),
      position: section.position,
    });
  }

  return blocks;
}

/**
 * 現在行のリスト要素に対して、先頭や末尾にテキストを追記します
 *
 * @param option.attached
 *   - prefix: 先頭に追記 (default)
 *   - suffix: 末尾に追記
 * @param option.cursor
 *   - last: 追記後、現在行の末尾にカーソルを移動する
 *
 * ```ts
 * await attachTextToListItem("👺")
 * await attachTextToListItem("🐈", { attached: "suffix", cursor: "last" })
 * ```
 */
export function attachTextToListItem(
  text: string,
  option?: { attached?: "prefix" | "suffix"; cursor?: "last" }
): void {
  const activeLine = helper.getActiveLine()!;
  const { prefix, content } = parseMarkdownList(activeLine);

  const attached = option?.attached ?? "prefix";
  let after: string;
  switch (attached) {
    case "prefix":
      after = `${prefix}${text}${content}`;
      break;
    case "suffix":
      after = `${prefix}${content}${text}`;
      break;
    default:
      throw new ExhaustiveError(attached);
  }

  helper.replaceStringInActiveLine(after, { cursor: option?.cursor });
}

/**
 * 選択中のテキスト複数行をソートします
 *
 * @param option.order
 *   - asc:  昇順 (default)
 *   - desc: 降順
 * @param option.predicate: ソートの指標決めロジック
 *
 * ```ts
 * sortSelectionLines()
 * // 文字列の長さで降順ソート
 * sortSelectionLines({ order: "desc", predicate: (x) => x.length })
 * ```
 */
export function sortSelectionLines(option?: {
  order?: "asc" | "desc";
  predicate?: (x: any) => string | number;
}): void {
  const order = option?.order ?? "asc";
  const predicate = option?.predicate ?? ((x) => x);

  const lines = getSelectionLines();
  if (!lines) {
    return;
  }

  const sortedLines = orderBy(lines, predicate, order);

  setTextToSelection(sortedLines.join("\n"));
}

/**
 * 選択範囲のテキストから装飾を除外します
 *
 * ◆実行後のbefore/after例
 * ```diff
 * - **hoge** _hoga_ ==hogu==
 * + hoge hoga hogu
 * ```
 */
export function stripDecorationFromSelection(): void {
  const striped = stripDecoration(helper.getSelection());
  helper.setSelection(striped);
}

/**
 * 選択範囲のテキストからリンクを除外します
 *
 * ◆実行後のbefore/after例
 * ```diff
 * - [hoge] [huga](xxx) [[fuga]]
 * + hoge huga fuga
 * ```
 */
export function stripLinksFromSelection(): void {
  const striped = stripLinks(helper.getSelection());
  helper.setSelection(striped);
}

/**
 * メッセージを通知します
 *
 * @param timeoutMs
 *   - 数値:   メッセージを自動で消去するミリ秒 (default: 5000ms)
 *   - never:  メッセージを自動で消去しない
 *
 * ```ts
 * notify("メッセージ")
 * notify("3秒で消えるメッセージ", 3000)
 * notify("自動で消去しないメッセージ", "never")
 * ```
 */
export function notify(
  text: string | DocumentFragment,
  timeoutMs: number | "never" = 5000
) {
  helper.notify(text, timeoutMs === "never" ? undefined : timeoutMs);
}

/**
 * 現在のファイルにおけるバックリンクのパスを取得します
 *
 * ```ts
 * getBacklinkPaths()
 * // ["Notes/backlink1.md", "Notes/backlink2.md"]
 * ```
 */
export function getBacklinkPaths(): string[] {
  return Object.keys(helper.getBacklinksByFilePathInActiveFile() ?? {});
}

/**
 * 現在ファイルの作成日時を取得します
 *
 * ```ts
 * getCreationDate("YYYY-MM-DD")
 * // "2023-11-06"
 * getCreationDate("unixtime")
 * // 1699259384
 * getCreationDate("moment")
 * // $ {_isAMomentObject: true, _isUTC: false, _pf: {…}, _locale: ne, _d: Mon Nov 06 2023 17:29:24 GMT+0900 (日本標準時), …}
 * ```
 */
export function getCreationDate(
  format: string | "unixtime" | "moment"
): string | number | Moment | null {
  const time = helper.getActiveFile().stat.ctime;
  switch (format) {
    case "unixtime":
      return time;
    case "moment":
      return helper.createMoment(time);
    default:
      return helper.createMoment(time).format(format);
  }
}

/**
 * 現在ファイルの更新日時を取得します
 *
 * ```ts
 * getUpdateDate("YYYY-MM-DD")
 * // "2023-11-06"
 * getUpdateDate("unixtime")
 * // 1699259384
 * getUpdateDate("moment")
 * // $ {_isAMomentObject: true, _isUTC: false, _pf: {…}, _locale: ne, _d: Mon Nov 06 2023 17:29:24 GMT+0900 (日本標準時), …}
 * ```
 */
export function getUpdateDate(
  format: string | "unixtime" | "moment"
): string | number | Moment | null {
  const time = helper.getActiveFile().stat.mtime;
  switch (format) {
    case "unixtime":
      return time;
    case "moment":
      return helper.createMoment(time);
    default:
      return helper.createMoment(time).format(format);
  }
}

/**
 * 現在日時を取得します
 *
 * ```ts
 * now("YYYY-MM-DD")
 * // "2023-11-06"
 * now("unixtime")
 * // 1699259384
 * now("moment")
 * // $ {_isAMomentObject: true, _isUTC: false, _pf: {…}, _locale: ne, _d: Mon Nov 06 2023 17:29:24 GMT+0900 (日本標準時), …}
 * ```
 */
export function now(
  format: string | "unixtime" | "moment"
): string | number | Moment {
  const nowMoment = helper.createMoment();
  switch (format) {
    case "unixtime":
      return nowMoment.unix();
    case "moment":
      return nowMoment;
    default:
      return nowMoment.format(format);
  }
}

/**
 * momentの日時を生成します
 *
 * ```ts
 * createMomentDate("2023-11-18")
 * createMomentDate(1700294267)
 * ```
 */
export function createMomentDate(value: string | number): Moment {
  return helper.createMoment(value);
}

/**
 * 入力ダイアログを表示します
 *
 * ```ts
 * await showInputDialog("名前を入力してください")
 * // "入力した名前"
 * ```
 */
export function showInputDialog(message: string): Promise<string | null> {
  const tp = helper.useTemplaterInternalFunction();
  return tp.system.prompt(message);
}

/**
 * 日付beginとendの間に存在するデイリーノートのファイルオブジェクトを取得します
 *
 * ```ts
 * getDailyNotes("2023-10-12", "2023-10-14")
 * // ["Daily Note/2023-10-12.md", "Daily Note/2023-10-13.md", "Daily Note/2023-10-14.md"]
 * ```
 */
export function getDailyNotes(begin: string, end: string): TFile[] {
  const dailySettings = helper.usePeriodicNotesSettings()?.settings.daily;
  if (!dailySettings) {
    throw new Error("Periodic Notes plugin is not installed.");
  }

  return getDatesInRange(helper.createMoment(begin), helper.createMoment(end))
    .map((x) =>
      helper.getFileByPath(
        `${dailySettings.folder}/${x.format(
          dailySettings.format || "YYYY-MM-DD"
        )}.md`
      )
    )
    .filter(isPresent);
}

/**
 * パスで指定したファイルの中身(テキスト)を取得します
 *
 * ```ts
 * await getFileContent("Notes/Obsidian.md")
 * // "Obsidianは最高のマークダウンエディタである\n完"
 * await getFileContent("Notes/Obsidian.md", { start: { offset: 1 }, end: { offset: 10 } })
 * // "bsidianは最"
 * ```
 */
export async function getFileContent(
  path: string,
  position?: {
    start: { offset: number };
    end: { offset: number };
  }
): Promise<string> {
  const content = await helper.loadFileContent(path, position);
  if (content == null) {
    throw new Error(`${path} is not existed.`);
  }

  return content;
}

/**
 * パスで指定したファイルの中身(テキスト)を取得します
 *
 * ```ts
 * await getContent()
 * // "Obsidianは最高のマークダウンエディタである\n完"
 * await getContent({ start: { offset: 1 }, end: { offset: 10 } })
 * // "bsidianは最"
 * ```
 */
export function getActiveFileContent(position?: {
  start: { line: number; col: number };
  end: { line: number; col: number };
}): string {
  const content = helper.getActiveFileContent(position);
  if (content == null) {
    throw new Error(`Couldn't get content from the active file.`);
  }

  return content;
}

/**
 * 現在のファイルのパスを取得します
 *
 * ```ts
 * getActiveFilePath()
 * // "Notes/activeFile.md"
 * ```
 */
export function getActiveFilePath(): string {
  return helper.getActiveFile().path;
}

/**
 * ファイルが存在するかを確認します
 *
 * ```ts
 * await fileExists("Notes/hoge.md")
 * // true
 * ```
 */
export function fileExists(path: string): Promise<boolean> {
  return helper.exists(path);
}

/**
 * ファイルを作成します
 *
 * ```ts
 * await createFile("Notes/mimizou.md", "みみぞうとはフクロウのぬいぐるみです")
 * ```
 */
export async function createFile(path: string, text?: string): Promise<TFile> {
  return helper.createFile(path, text);
}

/**
 * Vault内の全ファイルをVault rootからの相対パスをキーとしたMapで取得します
 *
 * ```ts
 * getAllFilesByPath()
 * // { "Notes/hoge.md": TFile, "Notes/hoga.md": TFile, ... }
 * ```
 */
export function getAllFilesByPath(): { [path: string]: TFile } {
  return helper.getFileMap();
}

/**
 * Vault内の全ファイルを取得します
 *
 * ```ts
 * getAllFiles()
 * // [TFile, TFile, ... , TFile]
 * ```
 */
export function getAllFiles(): TFile[] {
  return Object.values(getAllFilesByPath());
}

/**
 * ファイルを開きます
 *
 * ```ts
 * // 現在のLeafで開く
 * await openFile("Notes/hoge.md")
 * // 新しいLeafで開く
 * await openFile("Notes/hoge.md", {newLeaf})
 * ```
 */
export async function openFile(
  path: string,
  option?: { newLeaf: boolean }
): Promise<void> {
  return helper.openFile(path, option);
}

/**
 * クリップボードにテキストをコピーします
 *
 * ```ts
 * await copyToClipboard("コピーしたいテキスト")
 * ```
 */
export async function copyToClipboard(text: string): Promise<void> {
  await (navigator as any).clipboard.writeText(text);
}

/**
 * Obsidian PublishのURLを生成します
 *
 * ```ts
 * createObsidianPublishUrl("Notes/published_site.md")
 * // "https://minerva.mamansoft.net/Notes/published_site"
 * ```
 */
export async function createObsidianPublishUrl(path: string): Promise<string> {
  const host = await helper.getObsidianPublishHost();
  return `https://${host}/${encodeURI(path.replace(".md", ""))}`;
}

/**
 * エラーメッセージを通知して終了させます。この処理はthrowと一緒に使ってください
 * このコードはmdファイルにコンパイルする過程で、T.notifyとreturn文に変換されます
 *
 * ```ts
 * if (!file) {
 *   throw exit("ファイルが取得できませんでした")
 * }
 * ```
 */
export function exit(message: string): Error {
  return new Error(message);
}
