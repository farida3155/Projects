const express = require("express");
const router = express.Router();
const ContactUs = require("../../models/Contact");

router.get("/", async (req, res) => {
  try {
    const all = await ContactUs.find().sort({ _id: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
