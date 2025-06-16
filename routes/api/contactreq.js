// GET /api/contact
const express = require('express');
const router = express.Router();
const ContactReq = require('../../models/Contact');

router.get('/', async (req, res) => {
  try {
    const contacts = await ContactReq.find().sort({ date: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;