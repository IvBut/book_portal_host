const TOKENS_MAX_AGE = {
  ACCESS: 600,
  REFRESH: 5 * 24 * 60 * 60
};

const SESSION_MAX_COUNT = 5;

module.exports = {
  TOKENS_MAX_AGE,
  SESSION_MAX_COUNT
};
