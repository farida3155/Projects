const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    package: { type: String, enum: ['p1', 'p2', 'p3', null], default: null },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);