import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'capitalized-comments': [
        'error',
        'always',
        { ignoreConsecutiveComments: true }
      ],
      eqeqeq: ['error', 'always'],
      'no-template-curly-in-string': 'error',
      'no-useless-escape': 'error',
      'no-var': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'directive', next: '*' }
      ],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      strict: 'error'
    }
  },
  {
    files: ['test/fixtures/**'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
