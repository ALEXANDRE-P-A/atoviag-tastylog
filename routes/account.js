const router = require("express").Router();
const passport = require("passport");
const { 
  // authenticate, // 認証処理
  authorize, // 認可処理
  PRIVILEGE // 権限
} = require("../lib/security/accesscontrol.js");

// re-captcha implementation starts here
const GoogleRecaptch = require("google-recaptcha");
const recaptcha = new GoogleRecaptch({ secret: "6LcAhF0lAAAAAMYBsx19h4cDhm82IMXRKgK_LQJ_" });
// re-captcha implementation ends here

router.get("/", authorize(PRIVILEGE.NORMAL), (req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", (req, res) => {
  const recaptchaResponse = req.body['g-recaptcha-reponse'];

  recaptcha.verify({ response: recaptchaResponse }, err => {
    if(err){
      res.status(400).json({ error: "Invalid reCAPTCHA" }); // Invalid or expired reCAPTCHA response
    } else {
      passport.authenticate(
        'local-strategy',
        {
          successRedirect: "/account", // 成功時のリダイレクト先
          failureRedirect: "/account/login" // 失敗時のリダイレクト先
        }
      );
    }

  });
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