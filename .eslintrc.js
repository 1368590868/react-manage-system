module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint'), 'eslint:recommended'],

  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
};
