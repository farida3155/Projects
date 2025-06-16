const nodemailer = require('nodemailer');

async function sendConfirmationEmail(to, name) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
       tls: {
    rejectUnauthorized: false // 👈 This allows self-signed certs
  }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Pet Adoption Form Received 🐾',
      html: `<p>Hi ${name},</p> <p>We received your adoption form and we're <strong>super excited</strong> that you're interested in giving a pet a forever home! 🏡🐶🐱</p>

      <p>Our team will review your application shortly and reach out if we need more info. In the meantime, feel free to check out more of our furry friends or prepare your space for some extra tail-wagging joy. 💖</p>

      <hr style="margin: 20px 0; border: none; border-top: 1px dashed #ccc;">

      <p style="font-style: italic;">"Adopting one pet may not change the world... but for that one pet, their world will change forever."</p>

      <p style="margin-top: 30px;">With love, <br> 
      <strong>The Pet Adoption Center Team 🐾</strong></p>

      <p style="font-size: 12px; color: #888;">If this wasn’t you, please ignore this email.</p>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
}

module.exports = sendConfirmationEmail;
