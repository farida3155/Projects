const express = require('express');
const router = express.Router();
const AdoptionForm = require('../../models/AdoptionForm');

// POST /api/adoption-form
router.post('/submit', async (req, res) => {
  try {
    const form = new AdoptionForm(req.body);
    await form.validate(); // Explicit validation before saving
    await form.save();
    res.status(200).json({ message: "Form submitted successfully." });
  } catch (err) {
    console.error("Validation or save failed:", err);
    res.status(400).json({ message: "Form submission failed", error: err.message });
  }
});

module.exports = router;
