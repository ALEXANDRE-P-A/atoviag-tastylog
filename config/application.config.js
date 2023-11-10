module.exports = {
  PORT: process.env.PORT || 8080,
  security: {
    SESSION_SECRET: "ATOVIAG-SESSION-SECRET_STRING"
  },
  search: {
    MAX_ITEMS_PER_PAGE: 5
  }
};