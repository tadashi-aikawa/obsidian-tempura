import { ExhaustiveError } from "./errors";
import * as helper from "./helper";
import { UEditor } from "./types";
import { parseMarkdownList } from "./utils/parser";

/**
 * Use instances with a shorter syntax
 */
export function use(): { editor: UEditor | null } {
  return {
    editor: helper.getActiveEditor(),
  };
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
