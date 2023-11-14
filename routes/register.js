const router = require("express").Router();
const bcrypt = require("bcrypt");
const { MySQLClient, sql } = require("../lib/database/client.js");

router.get("/", (req, res) => {
  let name = '', newemail = '', newpassword = '', description = '';
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
  } catch(err){
    next(err);
  }
 
  res.redirect("/register/complete");
});

router.get("/complete",(req, res) => {
  res.render("./register/register-complete.ejs");
});
module.exports = router;