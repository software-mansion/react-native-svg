module.exports = {
  extends: '@react-native-community',
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  rules: {
    'no-bitwise': 'off',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
