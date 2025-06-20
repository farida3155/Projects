const jwt = require("jsonwebtoken");
const Admin = require("../models/admins");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided." });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "User not found." });
    req.user = { id: admin._id.toString(), role: admin.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};