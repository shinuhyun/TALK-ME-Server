const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

router.post('/signup', userController.signUp.post);
router.post('/login', userController.login.post);
router.get('/logout', userController.logout.get);

module.exports = router;
