import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import serve from "rollup-plugin-serve";
import { string } from "rollup-plugin-string";
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH || (process.env.NODE_ENV === "production");

export default {
  input: "src/main.ts",
  output:[
    {
    sourcemap: true,
    format: "iife",
    inlineDynamicImports: true,
    name: "app",
    file: "build/pyscript.js",
    },
    {
      file: "build/pyscript.min.js",
      format: "iife",
      sourcemap: true,
      inlineDynamicImports: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    svelte({
      // add postcss config
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [require("autoprefixer")],
        },
      }),
      compilerOptions: {
        dev: !production,
      },
    }),
    css({ output: "pyscript.css" }),
    // Bundle all the Python files into the output file
    string({
      include: "./src/**/*.py",
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    // This will make sure that examples will always get the latest build folder
    !production && copy({
        targets: [
          { src: 'build/*', dest: 'examples/build' }
        ]
      }),
    !production && serve(),
    !production && livereload("public"),
    // production && terser(),
    !production && serve({
      port: 8080,
      contentBase: 'examples'}
      )
  ],
  watch: {
    clearScreen: false,
  },
};
