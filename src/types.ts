import {
  App,
  Editor,
  MarkdownView,
  Vault,
  Workspace,
  FileView,
  TFile,
  LinkCache,
  ReferenceCache,
  CacheItem,
  Pos,
} from "obsidian";

export interface CodeBlock {
  language: string | null;
  content: string;
  position: Pos;
}

type Properties = {
  tags?: string | string[] | undefined | null;
  aliases?: string | string[] | undefined | null;
  [key: string]: any | any[] | undefined | null;
};

export type Moment = moment.Moment;
export type MomentInput = moment.MomentInput;

// From Obsidian 1.4.x
export interface FrontMatterLinkCache
  extends Omit<ReferenceCache, keyof CacheItem> {
  key: string;
}
export type ULinkCache = LinkCache | FrontMatterLinkCache;

export type UMetadataEditor = {
  addProperty(): void;
  focusValue(key: string): void;
  insertProperties(props: Properties): void;
};

export type UEditor = Editor;
export type UFileView = FileView;
export type UMarkdownView = MarkdownView;

type Config = {
  spellcheckDictionary?: string[];
  useMarkdownLinks?: boolean;
  newLinkFormat?: "shortest" | "relative" | "absolute";
  readableLineLength?: boolean;
};

export type UVault = Vault & {
  fileMap: { [path: string]: TFile };
  getConfig<K extends keyof Config>(key: K): Config[K];
  setConfig<K extends keyof Config>(key: K, value: Config[K]): void;
};

export type UWorkspace = Workspace & {
  getActiveFileView(): UFileView;
};

export type UApp = App & {
  workspace: UWorkspace;
  isMobile: boolean;
  vault: UVault;
  metadataCache: {
    getBacklinksForFile(file: TFile): { data: Record<string, ULinkCache[]> };
  };
  internalPlugins: {
    plugins: { [key: string]: any };
  };
  plugins: {
    plugins: {
      "periodic-notes"?: {
        settings: {
          daily: { folder?: string; format?: string | "" };
        };
      };
      [key: string]: any;
    };
  };
};

export type UTemplater = {
  system: {
    // https://silentvoid13.github.io/Templater/internal-functions/internal-modules/system-module.html

    // null: if cancel
    prompt(
      promptText?: string,
      defaultValue?: string,
      throwOnCancel?: boolean,
      multiline?: boolean
    ): Promise<string | null>;

    // null: if cancel
    suggester<T>(
      text_items: string[] | ((item: T) => string),
      items: T[],
      throw_on_cancel?: boolean,
      placeholder?: string,
      limit?: number
    ): Promise<T | null>;
  };
};
