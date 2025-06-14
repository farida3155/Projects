const users = require('../models/users_schema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

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
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: '"Petco Adoption" <petcopaws24@gmail.com>', 
            to: email, 
            subject: 'Welcome to Petco Adoption!',
            text: `Hello ${email},\n\nThank you for signing up for Petco Adoption!`
            
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

// Signin Controller
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