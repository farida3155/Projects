const express = require('express');
const router = express.Router();
const Donation = require('../../models/donation_schema');


// Get all adoption requests
router.get('/', async (req, res) => {
  try {
    const forms = await Donation.find().sort({ donatedAt: -1 });

    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch adoption requests' });
  }
});

module.exports = router;
