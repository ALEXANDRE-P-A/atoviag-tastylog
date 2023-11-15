const router = require("express").Router();
const bcrypt = require("bcrypt");
const tokens = new (require("csrf"))();
const { MySQLClient, sql } = require("../lib/database/client.js");
const { main } = require("../lib/sendmail/mailer.js");

router.get("/", async (req, res) => {
  let name = '', newemail = '', newpassword = '', description = '';

  let secret = await tokens.secret(); // secretの発行。
  let token = tokens.create(secret); // secretとtokenの生成。secretはサーバー保持(セッション)。tokenはクライアント返却(クッキー)
  req.session.atoviag_register = secret; // セッションatoviag_csrfにsecretを保存
  res.cookie("atoviag_register", token); // クッキーatoviag_csrfにtokenを保存

  res.render("./register/register.ejs", { name, newemail, newpassword, description });
});

router.post("/", (req, res) => {
  let { name, newemail, newpassword, description } = req.body;
  res.render("./register/register.ejs", { name, newemail, newpassword, description });
});

router.post("/confirm", (req, res) => {
  let { name, newemail, newpassword, description } = req.body;
  res.render("./register/register-confirm.ejs", { name, newemail, newpassword, description });
});

router.post("/execute", async (req, res, next) => {
  let secret = req.session.atoviag_register; // セッションからsecretを取り出す
  let token = req.cookies.atoviag_register; // クッキーからtokenを取り出す

  if(tokens.verify(secret, token) === false){ // secretとtokenが正しいかを確認(不正なアクセスの可能性を意味する)
    next(new Error("Invalid Token."));
    return;
  }

  let { name, newemail, newpassword, description } = req.body;

  // hash password (start here)
  let salt = await bcrypt.genSalt(10, "b");
  let hash_pass = await bcrypt.hash(newpassword, salt);
  // hash password (end here)

  try {
    await MySQLClient.executeQuery(
      await sql("REGISTER_NEW_MEMBER"),
      [name, newemail, hash_pass, description, newpassword]
    );
    main(newemail);
  } catch(err){
    next(err);
  }

  delete req.session.atoviag_register; // 正常に操作できた場合はセッションを破棄する
  res.clearCookie("atoviag_register"); // 正常に操作できた場合はクッキー破棄を指示
 
  res.redirect("/register/complete");
});

router.get("/complete",(req, res) => {
  res.render("./register/register-complete.ejs");
});
module.exports = router;