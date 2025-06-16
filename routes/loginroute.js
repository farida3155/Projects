const express = require('express');
const router = express.Router();
const { signup, signin, forgotPassword, resetPassword } = require('../controllers/logincontroller');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;