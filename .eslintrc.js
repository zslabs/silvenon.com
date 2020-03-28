module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['react-hooks'],
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/react',
  ],
  rules: {
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'react/default-props-match-prop-types': [
      'error',
      {
        allowRequiredDefaults: true,
      },
    ],
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': [
      'error',
      {
        forbidDefaultForRequired: false,
      },
    ],
    'react/sort-comp': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
  },

  overrides: [
    {
      files: ['src/**/*.js'],
      env: {
        browser: true,
      },
      rules: {
        'flowtype/require-valid-file-annotation': [
          'error',
          'always',
          {
            annotationStyle: 'line',
          },
        ],
      },
    },
    {
      files: ['**/*.test.js', '__tests__/**/*.js'],
      env: {
        browser: true,
        jest: true,
      },
    },
  ],
}
