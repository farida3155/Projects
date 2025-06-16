const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminsController');
const auth = require('../middleware/auth');

// All routes require authentication and superadmin for some actions
router.get('/', auth, adminController.getAllAdmins);
router.post('/', auth, adminController.createAdmin);
router.put('/:id', auth, adminController.updateAdmin);
router.delete('/:id', auth, adminController.deleteAdmin);

module.exports = router;