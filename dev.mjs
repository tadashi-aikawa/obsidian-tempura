import * as fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function build(target, dist) {
  const ts = fs.readFileSync(target, { encoding: "utf8" });
  let transformedLines = ts
    .split("\n")
    .map((line) =>
      line.startsWith("///") ? line.replace(/\/\/\/\s*/, "") : line
    );
  if (transformedLines.at(-1) === "") {
    // 最後の空行はフォーマッターによってつけられたものも多いので削除
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
