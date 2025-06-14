const express = require("express");
const router = express.Router();

const ADMIN = {
  username: "admin",
  password: "admin123",
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Both fields are required." });
  } 

  if (username === ADMIN.username && password === ADMIN.password) {
    return res.status(200).json({ message: "Login successful." });
  } else {
    return res.status(401).json({ message: "Invalid credentials." });
  }
});

module.exports = router;
