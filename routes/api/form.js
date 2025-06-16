const express = require("express");
const router = express.Router();
const AdoptionForm = require("../../models/AdoptionForm");
const sendConfirmationEmail = require("../../utils/confirmationEmail");

router.post("/", async (req, res) => {
  try {

     console.log("✅ Form submission received:", req.body); 
    const newForm = new AdoptionForm(req.body);
    await newForm.save();

    await sendConfirmationEmail(newForm.email, newForm.fullName);

    res.status(200).json({ message: "Form submitted & email sent!" });
  } catch (err) {
    console.error("Error in form submission:", err);
    res.status(500).json({ message: "Failed to submit form" });
  }
});

module.exports = router;
