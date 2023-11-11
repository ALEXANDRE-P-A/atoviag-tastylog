// const IS_PRODUCTION = process.env.NODE_ENV === "production";
// const env = require("dotenv");
// env.config();

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("./lib/log/logger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const cookie = require("cookie-parser");
const session =  require("express-session");
const MySqlStore = require("express-mysql-session")(session);
const flash = require("connect-flash");
const appconfig = require("./config/application.config.js");
const dbconfig = require("./config/mysql.config.js");
const accesscontrol = require("./lib/security/accesscontrol.js");

const PORT = process.env.PORT || 8080;

// Express settings.
const app = express();
app.set("view engine","ejs");
app.disable("x-powered-by");

// Expose global method to view engine.
app.use((req, res, next) => {
  res.locals.moment = require("moment");
  res.locals.padding = require("./lib/math/math.js").padding;
  next();
});

// Set access logger.
app.use(accesslogger());

// Static resources.
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

// Set middleware for POST method.
app.use(express.urlencoded({ extended: true }));

// Set middleware for cookie.
app.use(cookie());
app.use((req, res, next) => {
  res.cookie("cookie-message", "cookie_to_be_saved_on_client_side");
  next();
});

// Use session.
app.use(session({
  store: new MySqlStore({
    host: dbconfig.HOST,
    port: dbconfig.PORT,
    user: dbconfig.USERNAME,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
  }),
  // cookie: {
  //   secure: true
  // },
  secret: appconfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "atoviag_sid"
}));

// Set flash.
app.use(flash());

// Set passport initialization.
app.use(...accesscontrol.initialize());

// Dynamic resources.
app.use("/", require("./routes/index.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/search", require("./routes/search.js"));
app.use("/account", require("./routes/account.js"));

// Set application logger.
app.use(applicationlogger());

// Execute application.
app.listen(PORT,_=>{
  logger.application.info(`Application listening at http://127.0.0.1:${PORT}`);
});