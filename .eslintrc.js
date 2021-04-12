module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  ignorePatterns: ['src/__tests__'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single']
  }
};
