const express = require('express');
const router = express.Router();
const AdoptionFormAccepted = require('../../models/AcceptedForm'); // Adjust path if needed

// GET /admin-api/adoption-requests/history
router.get('/', async (req, res) => {
  try {
    const acceptedForms = await AdoptionFormAccepted.find().sort({ submittedAt: -1 }).lean();
    res.json(acceptedForms);
  } catch (error) {
    console.error('Error fetching adoption history:', error);
    res.status(500).json({ error: 'Server error fetching adoption history' });
  }
});

module.exports = router;
