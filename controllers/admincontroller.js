const { UserMail, Event } = require('../models/schema');
exports.getAllEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};
exports.addEvent = async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
};
exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
};