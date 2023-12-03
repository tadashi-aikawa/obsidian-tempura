import * as fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { transformFileSync } from "@babel/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function build(target, dist) {
  // TypeScriptファイルから型注釈をすべて除去
  const jsCode = transformFileSync(target, {
    plugins: ["@babel/plugin-transform-typescript"],
  }).code;

  let transformedLines = jsCode.split("\n").map((line) => {
    // Templater Script固有の表記をtsファイルに記載するためトリプルバックスラッシュを使っていたので削除
    const afterLine = line.startsWith("///")
      ? line.replace(/\/\/\/\s*/, "")
      : line;
    // 例外処理変換。 throw T.exit("...") を T.notify("...") と return にする
    // ただし、引数を省略した場合はreturnのみ
    const message = afterLine.match(/throw .+exit\((?<message>[^)]*)\)/)?.groups
      ?.message;
    return message == undefined
      ? afterLine
      : message === ""
      ? `  return`
      : `  T.notify(${message}); return`;
  });

  if (transformedLines.at(-1) === "") {
    // 最後の空行はフォーマッターによってつけられたものも多いので削除
    transformedLines.pop();
  }
  if (transformedLines.at(-1) === "export {};") {
    // 最後の`export {};`はimportが存在する場合にモジュールであることを明示するためにつけられるので削除
    transformedLines.pop();
  }

  fs.writeFileSync(dist, transformedLines.join("\n"));
}

function deploy(scriptPath) {
  const root = __dirname;
  fs.cpSync(
    resolve(root, "lib", "fryTempura.js"),
    resolve(scriptPath, "fryTempura.js")
  );
}

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case "deploy":
    const scriptPath = args[0];
    deploy(scriptPath);
    break;
  case "build":
    const [target, dist] = args;
    build(target, dist);
    break;
}
