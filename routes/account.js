const router = require("express").Router();
const { 
  authenticate, // 認証処理
  // authorize, // 認可処理
  // PRIVILEGE // 権限
} = require("../lib/security/accesscontrol.js");

router.get("/", (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", authenticate());

router.use("/reviews", require("./account.reviews.js"));

module.exports = router;