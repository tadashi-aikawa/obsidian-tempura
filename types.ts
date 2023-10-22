import { App, Editor, Vault } from "obsidian";

export type UEditor = Editor;

export type UVault = Vault & {
  config: {
    spellcheckDictionary?: string[];
    useMarkdownLinks?: false;
    newLinkFormat?: "shortest" | "relative" | "absolute";
  };
};

export type UApp = App & {
  isMobile: boolean;
  vault: UVault;
};
