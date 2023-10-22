import { UApp, UEditor } from "./types";

declare let app: UApp;

export const getActiveEditor = (): UEditor | null =>
  app.workspace.activeEditor?.editor ?? null;
