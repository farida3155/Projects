const express = require('express');
const router = express.Router();
const Pet = require('../../models/Pet');

// GET all pets
router.get('/', async (req, res) => {
  const pets = await Pet.find();
  res.json(pets);
});

// PUT (edit) a pet
router.put('/:id', async (req, res) => {
  await Pet.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Pet updated' });
});

// DELETE a pet
router.delete('/:id', async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pet deleted' });
});

module.exports = router;
