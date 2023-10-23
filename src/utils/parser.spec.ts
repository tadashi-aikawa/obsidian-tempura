import { expect, test } from "bun:test";
import { parseMarkdownList, parseTags } from "./parser";

test.each([
  ["", { prefix: "", content: "" }],
  ["hoge", { prefix: "", content: "hoge" }],
  ["- ", { prefix: "- ", content: "" }],
  ["- hoge", { prefix: "- ", content: "hoge" }],
  ["- [ ] hoge", { prefix: "- [ ] ", content: "hoge" }],
  ["- [x] hoge", { prefix: "- [x] ", content: "hoge" }],
  ["  hoge", { prefix: "  ", content: "hoge" }],
  ["  - ", { prefix: "  - ", content: "" }],
  ["  - hoge", { prefix: "  - ", content: "hoge" }],
  ["  - [ ] hoge", { prefix: "  - [ ] ", content: "hoge" }],
  ["  - [x] hoge", { prefix: "  - [x] ", content: "hoge" }],
  ["* ", { prefix: "* ", content: "" }],
  ["* hoge", { prefix: "* ", content: "hoge" }],
  ["* [ ] hoge", { prefix: "* [ ] ", content: "hoge" }],
  ["* [x] hoge", { prefix: "* [x] ", content: "hoge" }],
  ["\t- ", { prefix: "\t- ", content: "" }],
  ["\t- hoge", { prefix: "\t- ", content: "hoge" }],
  ["\t- [ ] hoge", { prefix: "\t- [ ] ", content: "hoge" }],
  ["\t- [x] hoge", { prefix: "\t- [x] ", content: "hoge" }],
  ["\t\t- ", { prefix: "\t\t- ", content: "" }],
  ["\t\t- hoge", { prefix: "\t\t- ", content: "hoge" }],
  ["\t\t- [ ] hoge", { prefix: "\t\t- [ ] ", content: "hoge" }],
  ["\t\t- [x] hoge", { prefix: "\t\t- [x] ", content: "hoge" }],
  ["　- ", { prefix: "　- ", content: "" }],
  ["　- hoge", { prefix: "　- ", content: "hoge" }],
  ["　- [ ] hoge", { prefix: "　- [ ] ", content: "hoge" }],
  ["　- [x] hoge", { prefix: "　- [x] ", content: "hoge" }],
  ["　　- ", { prefix: "　　- ", content: "" }],
  ["　　- hoge", { prefix: "　　- ", content: "hoge" }],
  ["　　- [ ] hoge", { prefix: "　　- [ ] ", content: "hoge" }],
  ["　　- [x] hoge", { prefix: "　　- [x] ", content: "hoge" }],
])(
  `parseMarkdownList("%s")`,
  (text: string, expected: ReturnType<typeof parseMarkdownList>) => {
    expect(parseMarkdownList(text)).toEqual(expected);
  }
);

test.each([
  ["#hoge", ["hoge"]],
  [" #hoge", ["hoge"]],
  ["#hoge ", ["hoge"]],
  [" #hoge ", ["hoge"]],
  ["  #hoge  ", ["hoge"]],
  ["#hoge #hoga", ["hoge", "hoga"]],
  ["hoge #hoga fuga", ["hoga"]],
  ["#hoge hoga #fuga", ["hoge", "fuga"]],
])(
  `parseTags("%s")`,
  (text: string, expected: ReturnType<typeof parseTags>) => {
    expect(parseTags(text)).toEqual(expected);
  }
);
