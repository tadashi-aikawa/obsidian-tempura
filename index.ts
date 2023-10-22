import { getActiveEditor } from "./helper";

/**
 * Insert text at the cursor position
 */
export async function insert(text: string): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {
    return;
  }

  editor.replaceRange(text, editor.getCursor());
}

module.exports = () => ({
  insert,
});
