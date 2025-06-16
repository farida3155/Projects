const express = require("express");
const router = express.Router();
const ContactUs = require("../../models/Contact");

// GET all contact submissions
router.get("/", async (req, res) => {
  try {
    const all = await ContactUs.find().sort({ _id: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD THIS: POST contact submission
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new ContactUs({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error("❌ Error saving contact form:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
