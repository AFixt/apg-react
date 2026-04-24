import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noSecrets from 'eslint-plugin-no-secrets';
import promise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// ESLint flat config — see docs/adr/0006-eslint-rule-calibration.md for why
// some rules from issue #61 are relaxed for this project.

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'storybook-static/**',
      'node_modules/**',
      '**/*.generated.*',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Core rules for TSX/TS source files (components + index)
  {
    files: ['components/**/*.{ts,tsx}', 'index.ts', 'types/**/*.d.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      sonarjs,
      unicorn,
      'import-x': importX,
      promise,
      jsdoc,
      'no-secrets': noSecrets,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ----- TypeScript -----
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ----- React -----
      'react/jsx-key': ['error', { checkFragmentShorthand: true, warnOnDuplicates: true }],
      'react/jsx-no-target-blank': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ----- Accessibility -----
      // NOTE: We keep jsx-a11y rules strict because this is an APG library.
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      // ----- SonarJS (code smells) -----
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': ['warn', { threshold: 5 }],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-small-switch': 'off', // Many APG keyboard handlers are short switches.
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',

      // ----- Unicorn -----
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': ['error', { cases: { pascalCase: true, kebabCase: true } }],
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prefer-module': 'off', // keep existing .js/CJS config files
      'unicorn/no-array-reduce': 'off',

      // ----- Imports -----
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'error',
      'import-x/no-duplicates': 'error',
      // NOTE: import-x/no-default-export intentionally OFF — every component
      // file uses `export default` as the public API. Changing that is a
      // breaking API change for consumers. See ADR-0006.

      // ----- Promises -----
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'warn',
      'promise/no-nesting': 'warn',

      // ----- JSDoc -----
      // NOTE: jsdoc/require-jsdoc is intentionally OFF pending a bulk JSDoc
      // pass on all 31 components (tracked separately). See ADR-0006.
      'jsdoc/check-tag-names': [
        'error',
        { definedTags: ['remarks', 'public', 'internal', 'beta', 'component'] },
      ],

      // ----- Secrets -----
      'no-secrets/no-secrets': [
        'error',
        { tolerance: 4.5, ignoreContent: ['https?://', 'data:image/'] },
      ],
    },
  },

  // Storybook stories: allow default exports and looser rules
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'react/no-unstable-nested-components': 'off',
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^(React|_)' },
      ],
      'no-undef': 'off',
    },
  },

  // Tests — looser rules
  {
    files: [
      '__tests__/**/*.{ts,tsx,js,jsx}',
      'e2e/**/*.{ts,tsx,js,jsx}',
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '__mocks__/**/*.{js,ts}',
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'jsdoc/require-jsdoc': 'off',
      'no-secrets/no-secrets': 'off',
    },
  },

  // Config files (Node / CJS)
  {
    files: [
      '*.config.{js,mjs,cjs}',
      '*.config.*.{js,mjs,cjs}',
      'rollup.config.mjs',
      'jest.config.js',
      'jest.setup.js',
      'e2e/jest.config.js',
      '.storybook/**/*.{js,ts}',
      '__mocks__/**/*.js',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'import-x/no-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'unicorn/prefer-module': 'off',
    },
  },

  prettier,
);
