/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Keep the subject line reasonable but not punitive.
    'header-max-length': [2, 'always', 100],
    // Allow the long scopes we use, e.g. "PR2 (#61)"
    'subject-case': [0],
  },
};
