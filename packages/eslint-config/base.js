/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:tailwindcss/recommended",
    "plugin:drizzle/recommended",
    "prettier",
  ],
  plugins: ["tailwindcss", "drizzle"],
  settings: {
    // Help eslint-plugin-tailwindcss to parse Tailwind classes outside of className
    tailwindcss: {
      callees: ["cn", "cva"],
    },
    jest: {
      version: 27,
    },
  },
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "arrow-body-style": ["warn", "as-needed"],
    // tailwind
    "tailwindcss/no-custom-classname": [
      "warn",
      {
        callees: ["cn", "cva"],
      },
    ],
    // @typescript-eslint
    // Note: you must disable the base rule as it can report incorrect errors
    "no-return-await": "off",
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
    // Note: you must disable the base rule as it can report incorrect errors
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-duplicate-imports": "error",
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "separate-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "all",
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: false,
      },
    ],
    // import
    // "import/no-cycle": "error", TODO: move that on a ci task
    "import/no-default-export": "warn",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    // drizzle
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "tx"],
      },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "tx"],
      },
    ],
  },
  ignorePatterns: [
    "/build",
    "/public/build",
    "*.config*",
    "/test/",
    "/public",
    ".*.js",
  ],
  overrides: [
    {
      files: [
        "./app/root.tsx",
        "./app/entry.client.tsx",
        "./app/entry.server.tsx",
        "./app/routes/**/*.tsx",
        "./server/index.ts",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
