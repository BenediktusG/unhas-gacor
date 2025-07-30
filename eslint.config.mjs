import globals from "globals";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import airbnbBase from 'eslint-config-airbnb-base';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  js.configs.recommended,
  { 
    files: ["src/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: globals.node,
      sourceType: "module",
      ecmaVersion: 'latest',

    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      "prettier/prettier": "error",
    },
  },
  prettier,
]);
