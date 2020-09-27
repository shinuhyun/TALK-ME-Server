const express = require("express");
const router = express.Router();

const { pwdController } = require("../controllers");

router.post("/askkey", pwdController.askkey.post);
router.post("/comparekey", pwdController.comparekey.post);
router.patch("/newpassword", pwdController.newpassword.patch);

module.exports = router;
