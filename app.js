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

// Set access logger.
app.use(accesslogger());

// Static resources.
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));

// Dynamic resources.
app.use("/", require("./routes/index.js"));
app.get("/dbaccess", async (req, res, next) => {
  const { promisify } = require("util");
  const config = require("./config/mysql.config.js");
  const mysql = require("mysql");
  const { sql } = require("@garafu/mysql-fileloader")({ root: path.join(__dirname, "./lib/database/sql") });

  const connection = mysql.createConnection({
    host: config.HOST,
    port: config.PORT,
    user: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE
  });

  const client = {
    connect: promisify(connection.connect).bind(connection),
    query: promisify(connection.query).bind(connection),
    end: promisify(connection.end).bind(connection)
  };

  let data;

  try {
    await client.connect();
    data =  await client.query(await sql("SELECT_SHOP_BY_ID"));
    console.log(data);
  } catch(err) {
    next(err);
  } finally {
    await client.end();
  }

  res.send("shop table connection OK.");
});

// Set application logger.
app.use(applicationlogger());

// Execute application.
app.listen(PORT,_=>{
  logger.application.info(`Application listening at http://127.0.0.1:${PORT}`);
});