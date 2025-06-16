const Admin = require('../models/admins');
const bcrypt = require('bcrypt');

// Get all admins (no passwords)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create admin (only superadmin can create a new superadmin)
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    let newRole = role;
    if (role === "superadmin") {
      if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can create another superadmin." });
      }
    } else {
      newRole = "admin";
    }

    const newAdmin = new Admin({ username, email, password: hashed, role: newRole });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update admin (only superadmin can promote to superadmin)
exports.updateAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const update = { username, email };

    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    if (role) {
      // Only superadmin can promote to superadmin
      if (role === "superadmin" && (!req.user || req.user.role !== "superadmin")) {
        return res.status(403).json({ message: "Only superadmin can assign superadmin role." });
      }
      update.role = role;
    }

    await Admin.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: 'Admin updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete admin (only superadmin, not self, not last superadmin)
exports.deleteAdmin = async (req, res) => {
  try {
    const adminIdToDelete = req.params.id;
    const requestingAdminId = req.user.id;

    // Only superadmin can delete
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can delete admins.' });
    }

    // Prevent self-delete
    if (adminIdToDelete === requestingAdminId) {
      return res.status(400).json({ message: "You can't delete your own account." });
    }

    // Prevent deletion if only one superadmin left
    const adminToDelete = await Admin.findById(adminIdToDelete);
    if (!adminToDelete) {
      return res.status(404).json({ message: "Admin not found." });
    }
    if (adminToDelete.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
      if (superadminCount <= 1) {
        return res.status(400).json({ message: "Can't delete the last superadmin." });
      }
    }

    await Admin.findByIdAndDelete(adminIdToDelete);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};