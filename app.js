const express = require("express");
const PORT = process.env.PORT || 8080;

// Express settings.
const app = express();
app.set("view engine","ejs");
app.disable("x-powered-by");

app.use("/", require("./routes/index.js"));

app.listen(PORT,_=>{
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
});