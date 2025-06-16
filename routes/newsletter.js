const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { UserMail } = require('../models/schema');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS  
  }
});

// Add transporter verification
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer verification error:', error);
  } else {
    console.log('Nodemailer transporter is ready!');
  }
});

router.post('/subscribe', async (req, res) => {
  console.log('POST /api/subscribe called with', req.body);
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  try {
    const exists = await UserMail.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'You are already subscribed.' });
    }

    const newUser = new UserMail({ email });
    await newUser.save();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '🐾 Welcome to the PetCo Family – Let’s Make Tails Wag!',
      text: 'Thank you for subscribing to PetCo Paws! We are thrilled to have you join our community of pet lovers. Get ready for exciting updates, exclusive offers, and heartwarming stories that will make your day brighter. Stay tuned for our first newsletter, packed with tips and tricks to keep your furry friends happy and healthy. Welcome aboard!🐾',
    };

    // Log before sending email
    console.log('Sending email to', email);

    await transporter.sendMail(mailOptions);

    console.log('Email sent to', email);

    return res.status(200).json({ success: true, message: 'A subscription email has been sent to you successfully.' });
  } catch (err) {
    console.error('ERROR in /subscribe:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

module.exports = router;