import * as tempura from "./functions";

export namespace user {
  const fryTempura: () => typeof tempura;
}

export type {
  UEditor,
  FrontMatterLinkCache,
  UMetadataEditor,
  TFile,
  Moment,
  MomentInput,
} from "./types";
