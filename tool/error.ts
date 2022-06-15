import { bold, cyan, dim, options, red } from "colorette";
import { basename, extname, isAbsolute, relative, resolve } from "path";
import { rollup, RollupError, RollupLogProps } from "rollup";

function getAliasName(id: string) {
  const base = basename(id);
  return base.substr(0, base.length - extname(id).length);
}

function relativeId(id: string) {
  if (!isAbsolute(id)) return id;
  return relative(resolve(), id);
}

// log to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind(console);
export const printError = (msg: string) => {
  return `(() => {
    const el = document.body.appendChild(document.createElement('div'));
    el.innerText = ${msg};
    Object.assign(el.style, {
      padding: '20px',
      margin: '0',
      fontSize: '12px',
      fontFamily: 'monospace',
      color: 'tomato',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'pre'
    })
  })();`;
};

export const handleError = (err: RollupError) => {
  let description = err.message || err;
  if (err.name) description = `${err.name}: ${description}`;
  const message =
    (err.plugin ? `(plugin ${err.plugin}) ${description}` : description) || err;

  stderr(bold(red(`[!] ${bold(message.toString())}`)));

  let url = err.url;
  if (url) {
    stderr(cyan(url));
  }

  let file = "";
  if (err.loc) {
    file = `${relativeId(err.loc.file || err.id!)} (${err.loc.line}:${
      err.loc.column
    })`;
  } else if (err.id) {
    file = relativeId(err.id);
  }

  if (file) {
    stderr(file);
  }

  if (err.frame) {
    stderr(dim(err.frame));
  }

  // hide for now
  // if (err.stack) {
  //   stderr(dim(err.stack));
  // }

  stderr("");

  return [message, url, file, err.frame, "\n", err.stack]
    .filter(Boolean)
    .join("\n");
};
