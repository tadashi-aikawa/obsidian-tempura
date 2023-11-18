import * as tempura from "./functions";

export namespace user {
  const fryTempura: () => typeof tempura;
}

export type {
  UEditor,
  FrontMatterLinkCache,
  UMetadataEditor,
  Moment,
  MomentInput,
  CodeBlock,
} from "./types";

export type { TFile } from "obsidian";
