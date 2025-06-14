const express = require('express');
const router = express.Router();
const { getAllEvents, addEvent, deleteEvent } = require('../controllers/admincontroller');

router.get('/events', getAllEvents);
router.post('/events', addEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;