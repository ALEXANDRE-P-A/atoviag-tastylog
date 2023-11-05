const router = require("express").Router();

router.get("/",(req, res) => {
  res.send("Welcome to Express Router.");
});

module.exports = router;