const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("./lib/log/logger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const accesslogger = require("./lib/log/accesslogger.js");

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

// Dynamic resources.
app.use("/", require("./routes/index.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/search", require("./routes/search.js"));

// Set application logger.
app.use(applicationlogger());

// Execute application.
app.listen(PORT,_=>{
  logger.application.info(`Application listening at http://127.0.0.1:${PORT}`);
});