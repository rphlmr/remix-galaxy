// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["stacks/**", "packages/**", "playgrounds/**"],
  extends: ["@remix-galaxy/eslint-config/base.js"],
};
