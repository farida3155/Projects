const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pet = require('scripts/petschema.js'); 
const app = express();
app.use(cors());
app.use(express.json());

// Serve images statically
app.use('/images', express.static('images'));

mongoose.connect('mongodb://localhost:27017/petco', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// GET pets
app.get('/api/pets', async (req, res) => {
  try {
    const filter = { upForAdoption: true };
    if (req.query.type) filter.type = req.query.type;
    const pets = await Pet.find(filter);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new pet
app.post('/api/pets', async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));