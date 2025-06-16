const users = require('../models/users_schema');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

exports.signup = async (req, res) => {
    let { email, password, confirmPassword } = req.body;
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (!email || !password || !confirmPassword) {
        return res.json({ status: "Failed", message: "Please fill all the fields" });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({ status: "Failed", message: "Please enter a valid email" });
    }

    if (password.length < 8) {
        return res.json({ status: "Failed", message: "Password should be at least 8 characters long" });
    }

    if (password !== confirmPassword) {
        return res.json({ status: "Failed", message: "Passwords do not match" });
    }

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.json({ status: "Failed", message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({ email, password: hashedPassword });

        const result = await newUser.save();

      
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        let mailOptions = {
            from: '"Petco Adoption" <petcopaws24@gmail.com>', 
            to: email, 
            subject: 'Welcome to the Petco Family! 🐾',
            html: `
                <div style="font-family: Arial, sans-serif; color: #444;">
                    <h2>Welcome to Petco Adoption, ${email}! 🎉</h2>
                    <p>We're so excited to have you join our community of animal lovers. Your journey to finding a loving companion starts here!</p>
                    <p>
                        <strong>What’s next?</strong><br>
                        Start exploring our adorable pets waiting for a forever home. 
                        Whether you’re looking for a playful puppy, a cuddly cat, or anything in between, we’re here to help you find your perfect match.
                    </p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="https://localhost:3000/adopt" style="display: inline-block; background: #1e88e5; color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                            🐶 Start Your Adoption Journey
                        </a>
                    </p>
                    <p>
                        If you have any questions, just reply to this email or reach out to our team—we’re always happy to help.<br><br>
                        Wishing you lots of tail wags and purrs,<br>
                        <strong>The Petco Adoption Team</strong>
                    </p>
                </div>
            `,
            text: `Welcome to Petco Adoption, ${email}!
            
        We're so excited to have you join our community of animal lovers. Your journey to finding a loving companion starts here!
        
        What’s next?
        Start exploring our adorable pets waiting for a forever home. Whether you’re looking for a playful puppy, a cuddly cat, or anything in between, we’re here to help you find your perfect match.
        
        Visit https://yourdomain.com/pets to get started!
        
        If you have any questions, just reply to this email or reach out to our team—we’re always happy to help.
        
        Wishing you lots of tail wags and purrs,
        The Petco Adoption Team
        `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Signup email sent to ' + email);
        } catch (emailErr) {
            console.error('Error sending signup email:', emailErr);
        }

        return res.json({ status: "Success", message: "User registered successfully", data: result });
    } catch (err) {
        console.error(err);
        return res.json({ status: "Failed", message: "Server error during signup" });
    }
};

exports.signin = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.json({ status: "Failed", message: "Empty credentials supplied" });
    }

    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.json({ status: "Failed", message: "Invalid credentials entered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: "Failed", message: "Incorrect password" });
        }

        return res.json({ status: "Success", message: "User logged in successfully", data: user });
    } catch (err) {
        console.error(err);
        return res.json({ status: "Failed", message: "Server error during login" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await users.findOne({ email }); // <-- users not User
      if (!user) {
        return res.status(400).json({ status: 'Fail', message: 'Email not found' });
      }
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
           user: emailUser,
           pass: emailPass
        },
      });
  
      const resetURL = `https://${req.headers.host}/reset-password?token=${resetToken}`;
  
      const mailOptions = {
        to: user.email,
        from: emailUser,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link to reset your password:\n\n${resetURL}`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ status: 'Success', message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Fail', message: 'Server error' });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    try {
      const user = await users.findOne({ 
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ status: 'Fail', message: 'Invalid or expired token' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ status: 'Fail', message: 'Passwords do not match' });
      }
  
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({ status: 'Success', message: 'Password has been reset' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Fail', message: 'Server error' });
    }
  };