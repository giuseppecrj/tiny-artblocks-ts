import terser from "terser";
import babelMinify from "babel-minify";

export async function compress(src: string, keepFuncNames = false) {
  // src = babelMinify(src, { mangle: false }).code;

  const result = await terser.minify(src, {
    ecma: 2020,
    keep_fnames: keepFuncNames,
    toplevel: true,
    compress: {
      arrows: true,
      drop_console: false,
      ecma: 2020,
      passes: 2,
      unsafe_arrows: true,
      toplevel: true,
      hoist_funs: true,
      dead_code: true,
    },
    mangle: true,
  });
  return result.code!;
}
