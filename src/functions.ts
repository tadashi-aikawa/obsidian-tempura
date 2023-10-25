import { FrontMatterCache } from "obsidian";
import { ExhaustiveError } from "./errors";
import * as helper from "./helper";
import { UEditor, UMetadataEditor } from "./types";
import { orderBy } from "./utils/collections";
import {
  parseMarkdownList,
  parseTags,
  stripDecoration,
  stripLinks,
} from "./utils/parser";

/**
 * Use instances with a shorter syntax
 */
export function use(): {
  editor: UEditor | null;
  frontmatter: FrontMatterCache | null;
  metadataEditor: UMetadataEditor | null;
} {
  return {
    editor: helper.getActiveEditor(),
    frontmatter: helper.getActiveFileFrontmatter(),
    metadataEditor: helper.getActiveMetadataEditor(),
  };
}

/**
 * Add a property to the frontmatter
 */
export function addProperty(key: string, values: any[]): void {
  const editor = helper.getActiveMetadataEditor();
  if (!editor) {
    return;
  }

  editor.insertProperties({ [key]: values });
}

/**
 * Update a property to the frontmatter
 */
export function updateProperty(key: string, values: any[]): void {
  removeProperty(key);
  addProperty(key, values);
}

/**
 * Remove a property from the frontmatter
 */
export function removeProperty(key: string): void {
  const editor = helper.getActiveMetadataEditor();
  if (!editor) {
    return;
  }

  editor.insertProperties({ [key]: null });
}

/**
 * Read tags from a "tags" property
 */
export function readTagsFromProperty(): string[] {
  return helper.getActiveFileFrontmatter()?.tags ?? [];
}

/**
 * Focus on the frontmatter value element
 */
export function focusPropertyValue(key: string): void {
  const editor = helper.getActiveMetadataEditor();
  if (!editor) {
    return;
  }

  editor.focusValue(key);
}

/**
 * Read aliases from a "aliases" property
 */
export function readAliasesFromProperty(): string[] {
  return helper.getActiveFileFrontmatter()?.aliases ?? [];
}

/**
 * Insert text at the cursor position
 */
export async function insert(text: string): Promise<void> {
  const editor = helper.getActiveEditor();
  if (!editor) {
    return;
  }

  editor.replaceRange(text, editor.getCursor());
}

/**
 * Get active line as string
 */
export function getActiveLine(): string | null {
  return helper.getActiveLine();
}

/**
 * Delete active line
 */
export function deleteActiveLine(): void {
  return helper.deleteActiveLine();
}

/**
 * Get tags from the active line
 */
export function getActiveLineTags(): string[] {
  const line = getActiveLine();
  return line ? parseTags(line) : [];
}

/**
 * Get selection lines
 */
export function getSelectionLines(): string[] | null {
  return helper.getActiveEditor()?.getSelection()?.split("\n") ?? null;
}

/**
 * Set text to selection
 */
export function setTextToSelection(text: string): void {
  helper.getActiveEditor()?.replaceSelection(text);
}

/**
 * Attach text to the specified list item as a prefix or a suffix
 */
export function attachTextToListItem(
  text: string,
  option?: { attached?: "prefix" | "suffix"; cursor?: "last" }
) {
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
 * Sort selection lines
 */
export function sortSelectionLines(option?: {
  order?: "asc" | "desc";
  predicate?: (x: any) => string | number;
}) {
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
 * Strip decoration from selection
 *
 * ex: "**hoge** _hoga_ ==hogu==" -> "hoge hoga hogu"
 */
export function stripDecorationFromSelection(): void {
  const selection = helper.getSelection();
  if (!selection) {
    return;
  }

  const striped = stripDecoration(selection);
  helper.setSelection(striped);
}

/**
 * Strip decoration from selection
 *
 * ex: "[hoge] [huga](xxx) [[fuga]]" -> "hoge huga fuga"
 */
export function stripLinksFromSelection(): void {
  const selection = helper.getSelection();
  if (!selection) {
    return;
  }

  const striped = stripLinks(selection);
  helper.setSelection(striped);
}
