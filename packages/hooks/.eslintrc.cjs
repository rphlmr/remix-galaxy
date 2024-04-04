/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@remix-galaxy/eslint-config/base.js"],
  parserOptions: {
      project: ["./tsconfig.json"],
  },
};
