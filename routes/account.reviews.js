const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";

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

router.get("/regist/:shopId(\\d+)", async (req, res, next) => {
  let shopId = req.params.shopId;
  let shop, shopName, review, results;
  
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

router.post("/regist/execute", async (req, res, next) => {
  let error = validateReviewData(req);
  let review = createReviewData(req);
  let { shopId, shopName } = req.body;
  let userId = "999"; // TODO:ログイン実装後に更新
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

  res.render("./account/reviews/regist-complete.ejs", { shopId });
});

module.exports = router;