const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    maxlength: 30,
    match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  package: {
    type: String,
    enum: ["p1", "p2", "p3", null],
    default: null
  },
  amount: {
    type: Number,
    min: 1
  },
  donatedAt: {
    type: Date,
    default: Date.now
  }
});


donationSchema.pre('save', function (next) {
  const hasAmount = typeof this.amount === 'number' && this.amount >= 1;
  const hasPackage = this.package !== null && this.package !== undefined;

  if (!hasAmount && !hasPackage) {
    const err = new Error('Either donation amount or package must be provided.');
    return next(err);
  }

  next();
});

module.exports = mongoose.model('Donation', donationSchema);