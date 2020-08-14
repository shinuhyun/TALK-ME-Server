const express = require('express');
const router = express.Router();

const { roomController } = require('../controllers');

router.post('/', roomController.roomCreate.post);
router.delete('/', roomController.roomDelete.delete);

module.exports = router;
