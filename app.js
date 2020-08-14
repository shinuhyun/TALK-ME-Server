require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const logger = require("morgan");

const app = express();
const port = process.env.PORT || 4000;

const questionRouter = require("./routes/question");
const roomRouter = require("./routes/room");
const roomListRouter = require("./routes/roomList");

app.use(
  session({
    secret: "@switzerland",
    resave: false,
    saveUninitialized: true,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/room/:roomId/questions", questionRouter);
app.use("/room", roomRouter);
app.use("/roomList", roomListRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
