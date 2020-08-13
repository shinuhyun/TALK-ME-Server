require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const questionRouter = require("./routes/question");
const roomRouter = require("./routes/room");

app.use(express.json());

app.use("/:roomId", questionRouter);
app.use("/room", roomRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
