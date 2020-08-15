const express = require("express");
const router = express.Router();

const { userController } = require("../controllers");

router.post("/signup", userController.signUp.post);

module.exports = router;
