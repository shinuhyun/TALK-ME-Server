const express = require("express");
const router = express.Router();

const { userController } = require("../controllers");

router.post("/signup", userController.signUp.post);
router.post("/login", userController.login.post);
router.get("/logout", userController.logout.get);

router.post("/pwinquiry/askkey", userController.askkey.post);
router.post("/pwinquiry/comparekey", userController.comparekey.post);
router.patch("/pwinquiry/newpassword", userController.newpassword.patch);

module.exports = router;
