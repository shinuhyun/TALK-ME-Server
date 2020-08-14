const express = require("express");
const router = express.Router();

const { roomListController } = require("../controllers");

router.get("/", roomListController.get);

module.exports = router;
