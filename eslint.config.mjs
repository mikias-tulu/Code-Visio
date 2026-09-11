import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist', 'out', '.vscode-test']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['*.mjs'],
    languageOptions: { globals: globals.node },
  },
);
