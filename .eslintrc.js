module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    es6: true,
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['external', 'internal', 'builtin'],
        pathGroups: [
          {
            pattern: '@**',
            group: 'internal',
            position: 'before',
          },
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: [],
      },
    ],

    'max-len': [1, 120, { ignoreComments: true, tabWidth: 2 }],
    // 'sort-keys': ['warn', 'asc', { caseSensitive: true, minKeys: 2, natural: false }],
  },
};
