const express = require('express');
const router = express.Router();
const { getAccounts } = require('../controllers/accountController');

router.get('/', getAccounts);

module.exports = router;