import * as fs from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function build(target, dist) {
  const ts = fs.readFileSync(target, { encoding: "utf8" });
  const transformed = ts
    .split("\n")
    .map((line) =>
      line.startsWith("///") ? line.replace(/\/\/\/\s*/, "") : line
    )
    .join("\n");
  fs.mkdirSync(dist, { recursive: true });
  const dst = `${dist}/${target.replace(/^src/, "/").replace(/.ts$/, ".md")}`;
  fs.writeFileSync(dst, transformed);
  console.log(`[success build] ${dst}`);
}

function main(path) {
  try {
    const config = JSON.parse(
      fs.readFileSync("./config.json", { encoding: "utf8" })
    );
    if (!config?.templater?.templateFolderLocation) {
      console.error(
        "The `templater.templateFolderLocation` key in the `config.json` is required."
      );
      return;
    }
    if (!config?.templater?.scriptFilesFolderLocation) {
      console.error(
        "The `templater.scriptFilesFolderLocation` key in the `config.json` is required."
      );
      return;
    }

    const root = __dirname;
    fs.cpSync(
      resolve(root, "lib", "fryTempura.js"),
      resolve(config.templater.scriptFilesFolderLocation, "fryTempura.js")
    );

    (path ? [path] : fs.readdirSync("src").map((x) => join("src", x))).forEach(
      (x) => build(x, config.templater.templateFolderLocation)
    );
  } catch (e) {
    console.error(e);
    console.error("Failed to parse ./config.json.");
  }
}

const [path] = process.argv.slice(2);
main(path);
