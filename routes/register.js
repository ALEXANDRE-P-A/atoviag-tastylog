const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./register/register.ejs");
});

module.exports = router;