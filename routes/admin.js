const express = require("express");
const router = express.Router();
const Admin = require("../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /admin-api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both fields are required." });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // JWT token for authentication
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      admin: {
        username: admin.username,
        email: admin.email,
        id: admin._id,
        role: admin.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;