const express = require("express");
const PORT = process.env.PORT || 8080;

// Express settings.
const app = express();
app.set("view engine","ejs");
app.disable("x-powered-by");

// Dynamic resources.
app.use("/", require("./routes/index.js"));

// Execute application.
app.listen(PORT,_=>{
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
});