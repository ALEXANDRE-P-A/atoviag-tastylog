const path = require("path");
const LOG_ROOT_DIR = process.env.LOG_ROOT_DIR || path.join(__dirname, "../logs");

module.exports = {
  appenders: {
    consoleLogAppender : {
      type: "console"
    },
    ApplicationLogAppender: {
      type: "dateFile",
      filename: path.join(LOG_ROOT_DIR, "./application.log"),
      pattern: "yyyyMMdd",
      numBackUp: 7
    },
    AccessLogAppender: {
      type: "dateFile",
      filename: path.join(LOG_ROOT_DIR, "./access.log"),
      pattern: "yyyyMMdd",
      numBackUp: 7
    }
  },
  categories: {
    "default": {
      appenders : [
        "consoleLogAppender"
      ],
      level: "ALL"
    },
    "application": {
      appenders : [
        "ApplicationLogAppender",
        "consoleLogAppender"
      ],
      level: "INFO"
    },
    "access": {
      appenders : [
        "AccessLogAppender",
        "consoleLogAppender"
      ],
      level: "INFO"
    }
  }
};