module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  // 'settings': {
  //   'import/extensions': ['.js', '.ts', '.mjs']
  // },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier', 'no-comments'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  overrides: [
    {
      'files': ['**/*.spec.ts'],
    },
  ],
  ignorePatterns: [
    '.eslintrc.js',
    '.commitlintrc.json',
    '**/*.spec.ts'
  ],
  rules: {
    'no-console': 'error',
    'no-nested-ternary': 'error',
    'no-underscore-dangle': 'error',
    'eol-last': ['error', 'always'],
    'operator-linebreak': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'function-paren-newline': ['error', 'consistent'],
    'linebreak-style': 0,
    'object-curly-newline': [
      'error',
      {
        'ObjectExpression': { "consistent": true },
        'ObjectPattern': { 'multiline': true },
        'ImportDeclaration': { "consistent": true },
        'ExportDeclaration': { 'multiline': true, 'minProperties': 4 }
      }
    ],
    'no-array-constructor': 'error',
    'no-bitwise': ['error', { 'int32Hint': true }],
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-catch-shadow': 'error',
    'no-class-assign': 'error',
    'no-cond-assign': 'error',
    'no-confusing-arrow': 'error',
    'no-unused-vars': 0,
    'no-control-regex': 0,
    'no-use-before-define': 'off',
    'no-duplicate-imports': 'error',
    'quotes': 'off',
    'comma-dangle': 'off',
    'no-param-reassign': 'error',
    'import/no-unresolved': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        'ts': 'never',
        'js': 'never',
        'mjs': 'never'
      }],
    'import/no-named-as-default': 0,
    'import/no-useless-path-segments': 'error',
    'import/no-named-as-default-member': 0,
    'import/no-relative-packages': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': false, 'optionalDependencies': false, 'peerDependencies': false }]
    ,
    'import/order': [
      'error',
      {
        'groups': [
          'external',
          'index',
          'sibling',
          'parent',
          'internal',
          'builtin',
          'object',
          'type'
        ]
      }
    ],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': ['error',
      {
        'arrays': 'only-multiline',
        'objects': 'only-multiline',
        'imports': 'only-multiline',
        'exports': 'only-multiline',
        'functions': 'only-multiline',
      }
    ],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/quotes': ['error', 'single'],
  },
};
