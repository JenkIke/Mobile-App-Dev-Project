// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  expoConfig,
  // Must come last: turns off ESLint rules that would conflict with Prettier formatting.
  prettierConfig,
  {
    ignores: ["dist/*"],
  },
]);
