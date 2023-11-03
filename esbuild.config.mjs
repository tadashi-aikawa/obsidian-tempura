import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  platform: "neutral",
  format: "cjs",
  bundle: true,
  outfile: "lib/fryTempura.js",
  minify: true,
});
