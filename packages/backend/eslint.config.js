import {antfu} from '@antfu/eslint-config';

export default antfu({
  rules: {'no-console': 'off'}
}, {
  files: ['**/*.ts', '**/*.js'],
  rules: {
    'style/max-statements-per-line': ['error', {max: 2}],
    'style/object-curly-spacing': ['error', 'never'],
    'style/brace-style': ['error', '1tbs', {allowSingleLine: true}]
  }
}, {
  files: ['**/*.ts'],
  rules: {curly: ['error', 'all']}
}, {
  files: ['**/*.js'],
  rules: {
    'style/max-statements-per-line': ['error', {max: 2}],
    'style/semi': ['error', 'always', {omitLastInOneLineBlock: true}],
    'style/comma-dangle': ['error', 'never'],
    'style/operator-linebreak': ['warn', 'before'],
    'style/arrow-parens': ['warn', 'always'],
    'style/brace-style': ['error', '1tbs', {allowSingleLine: true}],
    'prefer-template': 'warn',
    'antfu/top-level-function': 'off',
    'antfu/if-newline': 'off',
    'test/prefer-lowercase-title': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'curly': 'off'
  }
});

// import globals from "globals";
// import pluginJs from "@eslint/js";
//
//
// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
// ];
