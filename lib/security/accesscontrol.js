const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { MySQLClient, sql } = require("../database/client.js");

const PRIVILEGE = { // 権限
  NORMAL: "normal" // 通常権限
};

let initialize, authenticate, authorize;

// サーバーからクライアントへレスポンスするときセッションへ保持する処理
passport.serializeUser((user, done) => {}); // 今回は何もしない

// クライアントからサーバーへリクエストするときにセッションから情報を復元する処理
passport.deserializeUser((user, done) => {}); // 今回は何もしない

// 認証方法を設定
passport.use(
  "local-strategy", // ログイン処理で利用する認証方法を呼び出す為のキー
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, username, password, done) => { // 認証方法の具体的実装(メインの処理)
    let results, user;
    try {
      results = await MySQLClient.executeQuery(
        await sql("SELECT_USER_BY_EMAIL"),
        [username]
      );
    } catch(err) {
      return done(err);
    }
    if(results.length === 1 && // 成功パターン
      password === results[0].password){
        user = {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          permissions: [PRIVILEGE.NORMAL]
        };
        console.log(user.name,"logged");
        done(null, user); // -> authenticate() -> serializeUser()
      } else { // 失敗パターン(パスワードが一致しなかった場合など) // -> authenticate() -> serializeUser()
        done(null, false, req.flash("message", "Incorrect username or password"));
      }
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

module.exports = { 
  initialize, // 初期化処理
  authenticate, // 認証処理
  authorize, // 認可処理
  PRIVILEGE // 権限
};