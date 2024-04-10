const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("POST HISTORY");
});

module.exports =  router;