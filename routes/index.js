const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./index.ejs");
});

router.get("/overview", (req, res) => {
  res.render("./overview.ejs");
});

module.exports = router;