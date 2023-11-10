const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";
const tokens = new (require("csrf"))();

let validateReviewData = req => {
  let body = req.body;
  let isValid = true, error = {};

  if(body.visit && !moment(body.visit, DATE_FORMAT).isValid()){
    isValid = false;
    error.visit = "訪問日の日付文字列が不正です。";
  }

  if(isValid)
    return undefined;

  return error;
};

let createReviewData = req => {
  let body = req.body, date;

  return {
    shopId: req.params.shopId,
    score: parseFloat(body.score),
    visit: (date = moment(body.visit, DATE_FORMAT)) && date.isValid() ? date.toDate() : null,
    post: new Date(),
    description: body.description
  };
};

router.get("/regist/:shopId(\\d+)", async (req, res, next) => { // csrfの入口
  let shopId = req.params.shopId;
  let secret, token, shop, shopName, review, results;

  secret = await tokens.secret(); // secretの発行。
  token = tokens.create(secret); // secretとtokenの生成。secretはサーバー保持(セッション)。tokenはクライアント返却(クッキー)
  req.session.atoviag_csrf = secret; // セッションatoviag_csrfにsecretを保存
  res.cookie("atoviag_csrf", token); // クッキーatoviag_csrfにtokenを保存

  try {
    results = await MySQLClient.executeQuery(
      await sql("SELECT_SHOP_BASIC_BY_ID"),
      [shopId]
    );
    shop = results[0] || {};
    shopName = shop.name;
    review = {};
    res.render("./account/reviews/regist-form.ejs", { shopId, shopName, review });
  } catch(err) {
    next(err);
  }
});

router.post("/regist/:shopId(\\d+)", async (req, res, next) => {
  let review = createReviewData(req);
  let { shopId, shopName } = req.body;
  res.render("./account/reviews/regist-form.ejs", { shopId, shopName, review });
});

router.post("/regist/confirm", (req, res) => {
  let error =validateReviewData(req);
  let review = createReviewData(req);
  let { shopId, shopName } = req.body;

  if(error){
    res.render("./account/reviews/regist-form.ejs", { error, shopId, shopName, review });
  }

  res.render("./account/reviews/regist-confirm.ejs", { shopId, shopName, review });
});

router.post("/regist/execute", async (req, res, next) => { // トークンの確認(csrfの出口)、最後に破棄
  let secret = req.session.atoviag_csrf; // セッションからsecretを取り出す
  let token = req.cookies.atoviag_csrf; // クッキーからtokenを取り出す

  if(tokens.verify(secret, token) === false){ // secretとtokenが正しいかを確認(不正なアクセスの可能性を意味する)
    next(new Error("Invalid Token."));
    return;
  }

  let error = validateReviewData(req);
  let review = createReviewData(req);
  let { shopId, shopName } = req.body;
  let userId = req.user.id;
  let transaction;

  if(error){
    res.render("./account/reviews/regist-form.ejs", { error, shopId, shopName, review });
    return;
  }

  try {
    transaction = await MySQLClient.beginTransaction();
    transaction.executeQuery(
      await sql("SELECT_SHOP_BY_ID_FOR_UPDATE"),
      [shopId]
    );
    transaction.executeQuery(
      await sql("INSERT_SHOP_REVIEW"),
      [shopId, userId, review.score, review.visit, review.description]
    );
    transaction.executeQuery(
      await sql("UPDATE_SHOP_SCORE_BY_ID"),
      [shopId, shopId]
    );
    await transaction.commit();
  } catch(err) {
    await transaction.rollback();
    next(err);
  }

  delete req.session.atoviag_csrf; // 正常に操作できた場合はセッションを破棄する
  res.clearCookie("atoviag_csrf"); // 正常に操作できた場合はクッキー破棄を指示

  res.redirect(`/account/reviews/regist/complete?shopId=${shopId}`);
});

router.get("/regist/complete", (req, res) => {
  res.render("./account/reviews/regist-complete.ejs", { shopId: req.query.shopId });
});

module.exports = router;