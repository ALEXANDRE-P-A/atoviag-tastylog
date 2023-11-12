const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { MySQLClient, sql } = require("../database/client.js");
const bcrypt = require("bcrypt");
const moment = require("moment");

const {
    ACCOUNT_LOCK_WINDOW,
    ACCOUNT_LOCK_THRESHOLD,
    ACCOUNT_LOCK_TIME,
  MAX_LOGIN_HISTORY
} = require("../../config/application.config.js").security;

const PRIVILEGE = { // 権限
  NORMAL: "normal" // 通常権限
};

const LOGIN_STATUS = {
  SUCCESS: 0,
  FAILURE: 1
};

let initialize, authenticate, authorize;

// サーバーからクライアントへレスポンスするときセッションへ保持する処理
passport.serializeUser((user, done) => {  // 今回は何もしない
  done(null, user);
});

// クライアントからサーバーへリクエストするときにセッションから情報を復元する処理
passport.deserializeUser((user, done) => { // 今回は何もしない
  done(null, user);
});

// 認証方法を設定
passport.use(
  "local-strategy", // ログイン処理で利用する認証方法を呼び出す為のキー
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, username, password, done) => { // 認証方法の具体的実装(メインの処理)
    let results, user, count;
    let now = new Date();
    try {
      results = await MySQLClient.executeQuery( // Get User Info
        await sql("SELECT_USER_BY_EMAIL_FOR_UPDATE"),
        [username]
      );
      // Check the account existence
      if(results.length !== 1)
        return done(null, false, req.flash("message", "Incorrect username or password"));

      user = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        permissions: [PRIVILEGE.NORMAL]
      };

      // Check the account lock status
      if(results[0].locked &&
        moment(now).isSameOrBefore(
          moment(results[0].locked).add(ACCOUNT_LOCK_TIME, "minutes")
        )){
          return done(null, false, req.flash("message", "The account is locked. Please try again after 60 minutes after the last attempt or change the password"));
        }

      // Delete old login log
      await MySQLClient.executeQuery(
        await sql("DELETE_LOGIN_HISTORY"),
        [user.id, user.id, MAX_LOGIN_HISTORY-1]
      );

      // Compare password
      if(!await bcrypt.compare(password, results[0].password)){
        // Insert login history
        await MySQLClient.executeQuery(
          await sql("INSERT_LOGIN_HISTORY"),
          [user.id, now, LOGIN_STATUS.FAILURE]
        );

        // Lock account if need
        let tmp = await MySQLClient.executeQuery(
          await sql("COUNT_LOGIN_HISTORY"),
          [
            user.id,
            moment(now).subtract(ACCOUNT_LOCK_WINDOW, "minutes").toDate(),
            LOGIN_STATUS.FAILURE
          ]
        );
        count = (tmp || [])[0].count;
        if(count >= ACCOUNT_LOCK_THRESHOLD){
          await MySQLClient.executeQuery(
            await sql("UPDATE_USER_LOCKED"),
            [now, user.id]
          );
        }
        return done(null, false, req.flash("message", "Incorrect username or password"));
      }
      // Insert login history
      await MySQLClient.executeQuery(
        await sql("INSERT_LOGIN_HISTORY"),
        [user.id, now, LOGIN_STATUS.SUCCESS]
      );
    } catch(err) {
      return done(err);
    }   
    req.session.regenerate(err => { // ログイン後にセッションの再生成
      if(err) // エラーのなった場合はエラーで返す
        done(err);
      else
        done(null, user); // -> authenticate() -> serializeUser()
    });
    console.log(user.name,"logged");
  })
);

initialize = _ => {
  return [
    passport.initialize(),
    passport.session(),
    (req, res, next) => { // ログイン状態を確認しやすくするミドルウェア
      if(req.user) // ログイン状態が保存されているオブジェクト
        res.locals.user = req.user; // ユーザーの情報を引き渡す
      next();
    }
  ];
};

authenticate = _ => { // ログイン処理用ミドルウェアの初期化
  return passport.authenticate(
    "local-strategy",
    {
      successRedirect: "/account", // 成功時のリダイレクト先
      failureRedirect: "/account/login" // 失敗時のリダイレクト先
    }
  );
};

authorize = privilege => {
  return (req, res, next) => {
    if(req.isAuthenticated() && (req.user.permissions || []).indexOf(privilege) >= 0)
      next();
    else
      res.redirect("/account/login");
  };
};

module.exports = { 
  initialize, // 初期化処理
  authenticate, // 認証処理
  authorize, // 認可処理
  PRIVILEGE // 権限
};