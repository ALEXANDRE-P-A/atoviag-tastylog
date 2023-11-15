const router = require("express").Router();
const { 
  // authenticate, // 認証処理
  authorize, // 認可処理
  PRIVILEGE // 権限
} = require("../lib/security/accesscontrol.js");

// re-captcha implementation starts here
const GoogleRecaptch = require("google-recaptcha");
const recaptcha = new GoogleRecaptch({ secret: "6LcAhF0lAAAAALXvCkGE9iylWOFu_pjNNJzyh0Dm" });
// re-captcha implementation ends here

router.get("/", authorize(PRIVILEGE.NORMAL), (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const recaptchaResponse = req.body['g-recaptcha-response'];

  recaptcha.verify({ response: recaptchaResponse }, err => {
    if(err){
      res.status(400).json({ error: "Invalid reCAPTCHA" }); // Invalid or expired reCAPTCHA response
    } else {
      res.redirect('/account/login/authenticate');
    }
  });
});

router.post("/login/authenticate", (req, res) => {
  res.end("Ok");
});

router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if(err)
      return next(err);
    res.redirect("/account/login");
  });
});

router.use("/reviews", authorize(PRIVILEGE.NORMAL), require("./account.reviews.js"));

module.exports = router;