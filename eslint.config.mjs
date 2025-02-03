import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.browser,
    },
   
    overrides: [
      {
        files: ["webpack.config.js", "webpack.*.js"],
        languageOptions: {
          sourceType: "script", 
        },
      },
    ],
   
    ...pluginJs.configs.recommended,
  },
];
