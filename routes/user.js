const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

router.post('/signup', userController.signup.post);
router.post('/login', userController.login.post);
router.get('/social', userController.social.get);
router.get('/logout', userController.logout.get);
router.get('/isLogin', userController.isLogin.get);

module.exports = router;
