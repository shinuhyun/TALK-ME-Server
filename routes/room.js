const express = require("express");
const router = express.Router();

const { roomController } = require("../controllers");

router.post("/", roomController.roomCreate.post);

module.exports = router;
