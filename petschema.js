const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  age: String,
  breed: String,
  gender: String,
  neutered: String,
  location: String,
  image: String,
  upForAdoption: { type: Boolean, default: true },
  type: { type: String, enum: ['cat', 'dog'], required: true }
});

module.exports = mongoose.model('Pet', petSchema);