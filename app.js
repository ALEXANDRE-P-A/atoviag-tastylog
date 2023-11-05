const express = require("express");
const PORT = process.env.PORT || 8080;

const app = express();

app.use("/",require("./routes/index.js"));

app.listen(PORT,_=>{
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
});