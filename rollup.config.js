import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
    },
  ],
  // external: builtins,
  external: [
    "react",
    "react-dom",
    "fs",
    "util",
    "stream",
    "buffer",
    "zlib",
    "assert",
  ],
  plugins: [
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      extensions: [".css"],
      minimize: true,
      inject: {
        insertAt: "top",
      },
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
    }),
    babel({
      exclude: "node_modules/**",
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      extensions: [".js", ".ts", ".tsx"],
    }),
    terser(),
  ],
};
