require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const ip = process.env.IP || "localhost";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, ip, () => {
  console.log(`Example app listening at http://${ip}:${port}`);
});
