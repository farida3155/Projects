const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/donate', donationController.donate);

module.exports = router;