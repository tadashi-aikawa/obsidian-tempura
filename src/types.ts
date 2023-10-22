import {
  App,
  Editor,
  MarkdownView,
  Vault,
  Workspace,
  FileView,
} from "obsidian";

export type UEditor = Editor;
export type UFileView = FileView;
export type UMarkdownView = MarkdownView;

export type UVault = Vault & {
  config: {
    spellcheckDictionary?: string[];
    useMarkdownLinks?: false;
    newLinkFormat?: "shortest" | "relative" | "absolute";
  };
};

export type UWorkspace = Workspace;

export type UApp = App & {
  workspace: UWorkspace;
  isMobile: boolean;
  vault: UVault;
};
