/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0
const WARN = 1
const ERROR = 2
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    React: "writable",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // TODO: is there a way to only enable these rules when unable to inferrable
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/explicit-module-boundary-types": OFF,
    "@typescript-eslint/interface-name-prefix": OFF,
    "@typescript-eslint/semi": OFF,
    "@typescript-eslint/no-unused-vars": WARN,
    "@typescript-eslint/ban-types": WARN, // WARN as Codegen generates a lot of {}
    "import/prefer-default-export": OFF,
    "space-infix-ops": OFF,
  },
}
