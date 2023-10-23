import {
  App,
  Editor,
  MarkdownView,
  Vault,
  Workspace,
  FileView,
} from "obsidian";

type Properties = {
  tags?: string | string[] | undefined;
  aliases?: string | string[] | undefined;
  [key: string]: any | any[] | undefined;
};

export type UMetadataEditor = {
  addProperty(): void;
  focusValue(key: string): void;
  insertProperties(props: Properties): void;
};

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
