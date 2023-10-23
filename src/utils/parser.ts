export function parseMarkdownList(text: string): {
  prefix: string;
  content: string;
} {
  const result = Array.from(
    text.matchAll(/^(?<prefix>[ \t\s]*([-*] (\[.] |)|))(?<content>.*)$/g)
  ).at(0);

  return {
    prefix: result?.groups?.prefix ?? "",
    content: result?.groups?.content ?? "",
  };
}

export function parseTags(text: string): string[] {
  return text
    .split(" ")
    .filter((x) => x.startsWith("#"))
    .map((x) => x.slice(1));
}
