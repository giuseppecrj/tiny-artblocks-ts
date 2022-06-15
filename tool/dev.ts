import { rollup, RollupError, RollupLogProps } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginJson from "@rollup/plugin-json";
import * as liveServer from "live-server";
import { handleError, printError } from "./error";
import prettyBytes from "pretty-bytes";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { compress } from "./compress";
import { inspect } from "./inspect";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const mode = process.argv.slice(2).includes("--dev")
  ? "development"
  : "production";
const gwei = 125;

const INPUT_FILE = path.resolve(__dirname, "../src/index.ts");
const OUTPUT_FILE = path.resolve(__dirname, "../www/main.js");
const OUTPUT_FILE_MIN = path.resolve(__dirname, "../www/main.min.js");

const PORT = 8081;

if (mode === "development") {
  (async () => {
    await build();
    console.log(`Starting development server on http://localhost:${PORT}/`);
    liveServer.start({
      port: PORT,
      open: false,
      logLevel: 0,
      root: path.resolve(__dirname, "../www"),
      ignore: path.resolve(__dirname, "../www/*.js"),
      watch: [
        path.resolve(__dirname, "../src/**/*.ts"),
        path.resolve(__dirname, "../www/index.html"),
      ],
      middleware: [
        async (req, res, next) => {
          if (req.url === "/main.min.js") {
            const src = await build();
            res.setHeader("Content-Type", "text/javascript");
            res.end(src);
          } else {
            next(null);
          }
        },
      ],
    });
  })();
} else if (process.argv.slice(2).includes("--inspect")) {
  (async () => {
    const src = await bundle();
    inspect(src);
  })();
} else {
  build();
}
async function build() {
  try {
    const src = await bundle();
    const min = await compress(src);
    await writeFile(OUTPUT_FILE_MIN, min);

    console.log(`Minified Bytes: ${min.length} (${prettyBytes(min.length)})`);
    const eth = 675 * min.length * gwei * (1 / 1000000000);
    console.log(`~${eth.toFixed(4)} ETH at ${gwei} gwei`);
    return min;
  } catch (err: any | RollupError) {
    let msg = err.toString();
    if (err.frame) {
      msg = handleError(err);
    }
    msg = JSON.stringify(msg);
    return printError(msg);
  }
}

async function bundle() {
  const bundle = await rollup({
    input: INPUT_FILE,
    // not advisable to use npm modules, but useful for prototyping
    plugins: [
      nodeResolve({
        browser: true,
      }),
      pluginJson(),
      pluginTypescript({
        allowSyntheticDefaultImports: true,
      }),
    ],
    // ignore this warning
    onwarn: (w, def) => {
      if (w.code !== "MISSING_NAME_OPTION_FOR_IIFE_EXPORT") def(w);
    },
  });
  // write the bundle to disk
  await bundle.write({
    file: OUTPUT_FILE,
    format: "iife",
  });

  // closes the bundle
  await bundle.close();

  return readFile(OUTPUT_FILE, "utf-8");
}
