/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0;
const WARN = 1;
const ERROR = 2;
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
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/interface-name-prefix": OFF,
    "@typescript-eslint/semi": OFF,
    "@typescript-eslint/no-unused-vars": ERROR,
    "@typescript-eslint/no-var-requires": WARN,
    "import/prefer-default-export": OFF,
    "space-infix-ops": OFF,
  },
};
