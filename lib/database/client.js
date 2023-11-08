const { promisify } = require("util");
const path = require("path");
const config = require("../../config/mysql.config.js");
const mysql = require("mysql");
const { sql } = require("@garafu/mysql-fileloader")({ root: path.join(__dirname, "./sql") });

const connection = mysql.createConnection({
  host: config.HOST,
  port: config.PORT,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE
});

const MySQLClient = {
  connect: promisify(connection.connect).bind(connection),
  query: promisify(connection.query).bind(connection),
  end: promisify(connection.end).bind(connection)
};

module.exports = { MySQLClient, sql };