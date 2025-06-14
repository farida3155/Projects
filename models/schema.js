const mongoose = require('mongoose');

const userMailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  month: String,
  time: String,
  img: String,
  desc: String,
});

const UserMail = mongoose.model('UserMail', userMailSchema, 'usermails');
const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = {
  UserMail,
  Event
};