const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./index.ejs");
});

router.get("/overview", (req, res) => {
  res.send("Application Overview");
});

module.exports = router;