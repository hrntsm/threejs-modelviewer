import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const plugins = [
  nodeResolve(),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser());
}

export default {
  input: "src/app.js",
  output: {
    file: "bundle.js",
    format: "cjs"
  },
  plugins
};