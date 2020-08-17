const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

router.post('/social', userController.social.post);
router.post('/signup', userController.signup.post);
router.post('/login', userController.login.post);
router.get('/logout', userController.logout.get);
router.get('/isLogin', userController.isLogin.get);

module.exports = router;
