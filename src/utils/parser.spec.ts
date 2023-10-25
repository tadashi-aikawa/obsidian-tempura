import { expect, test } from "bun:test";
import {
  parseMarkdownList,
  parseTags,
  stripDecoration,
  stripLinks,
} from "./parser";

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

test.each([
  // bold
  ["**a**", "a"],
  ["a **a** a", "a a a"],
  ["**a** **a**", "a a"],
  ["**abc** **efg**", "abc efg"],

  ["__a__", "a"],
  ["a __a__ a", "a a a"],
  ["__a__ __a__", "a a"],
  ["__abc__ __efg__", "abc efg"],

  // italic
  ["*a*", "a"],
  ["a *a* a", "a a a"],

  ["_a_", "a"],
  ["a _a_ a", "a a a"],

  // bold and italic
  ["**abc *d* efg**", "abc d efg"],
  ["__abc _d_ efg__", "abc d efg"],

  // strikethrough
  ["~~a~~", "a"],

  // highlight
  ["==a==", "a"],

  // mixed
  ["a **b** ~~c~~ ==d== e", "a b c d e"],
])(
  `stripDecoration("%s")`,
  (text: string, expected: ReturnType<typeof stripDecoration>) => {
    expect(stripDecoration(text)).toEqual(expected);
  }
);

test.each([
  // link
  ["[text](link)", "text"],
  ["[text](link) [text2](link2)", "text text2"],
  ["[text]", "text"],
  ["[text] [text2]", "text text2"],

  // wiki link
  ["[[text]]", "text"],
  ["[[text]] [[text2]]", "text text2"],
  ["[[text|alias]]", "alias"],
  ["[[text|alias]] [[text2|alias2]]", "alias alias2"],

  // mixed
  ["[e](link) [[f]] [g] [[h|H!]]", "e f g H!"],
])(
  `stripLinks("%s")`,
  (text: string, expected: ReturnType<typeof stripLinks>) => {
    expect(stripLinks(text)).toEqual(expected);
  }
);
