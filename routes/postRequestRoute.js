const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostRequest = require('../models/postRequestSchema');
const Pet = require('../models/petSchema');

// Configure file storage for pet photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/post-requests');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only! (JPEG, JPG, PNG)'));
    }
  }
});

// GET all post requests (for /api/post-requests)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await PostRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all post requests (for /api/post-requests/admin/post-requests)
router.get('/admin/post-requests', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await PostRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve route for /api/post-requests/:id/approve
router.post('/:id/approve', async (req, res) => {
  try {
    const requestId = req.params.id;
    const existingRequest = await PostRequest.findById(requestId);

    if (!existingRequest) {
      return res.status(404).json({ error: 'Post request not found' });
    }

    // Defensive: ensure petDetails exists and is an object
    if (!existingRequest.petDetails || typeof existingRequest.petDetails !== 'object') {
      return res.status(400).json({ error: 'No petDetails found in this request' });
    }

    // Validate all required pet details
    const pd = existingRequest.petDetails;
    const typeMap = { 'Cat': 'cat', 'Dog': 'dog' };
    if (
      !pd.name ||
      !pd.age ||
      typeof pd.age.value !== 'number' ||
      !pd.age.unit ||
      !['months', 'years'].includes(pd.age.unit) ||
      !pd.gender ||
      !['Male', 'Female'].includes(pd.gender) ||
      !pd.neutered ||
      !['Yes', 'No'].includes(pd.neutered) ||
      !pd.breed ||
      !pd.type ||
      !typeMap[pd.type] ||
      !pd.location
    ) {
      return res.status(400).json({ error: 'Missing or invalid required pet details for creating pet.' });
    }

    // Set status to approved
    existingRequest.status = 'approved';
    await existingRequest.save();

    // Create Pet
    const newPet = new Pet({
      name: pd.name,
      age: {
        value: pd.age.value,
        unit: pd.age.unit
      },
      breed: pd.breed,
      gender: pd.gender,
      neutered: pd.neutered,
      location: pd.location,
      image: existingRequest.images?.[0] || null,
      upForAdoption: true,
      type: typeMap[pd.type]
    });
    await newPet.save();

    res.status(200).json({
      success: true,
      message: 'Post request approved and pet added!',
      request: existingRequest
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: error.message });
  }
});

// (You may keep the /admin/post-requests/:id/approve route for compatibility)
router.post('/admin/post-requests/:id/approve', async (req, res) => {
  try {
    const requestId = req.params.id;
    const existingRequest = await PostRequest.findById(requestId);

    if (!existingRequest) {
      return res.status(404).json({ error: 'Post request not found' });
    }

    if (!existingRequest.petDetails || typeof existingRequest.petDetails !== 'object') {
      return res.status(400).json({ error: 'No petDetails found in this request' });
    }

    existingRequest.status = 'approved';
    await existingRequest.save();

    const pd = existingRequest.petDetails;
    const typeMap = { 'Cat': 'cat', 'Dog': 'dog' };
    if (
      !pd.name ||
      !pd.age ||
      typeof pd.age.value !== 'number' ||
      !pd.age.unit ||
      !['months', 'years'].includes(pd.age.unit) ||
      !pd.gender ||
      !['Male', 'Female'].includes(pd.gender) ||
      !pd.neutered ||
      !['Yes', 'No'].includes(pd.neutered) ||
      !pd.breed ||
      !pd.type ||
      !typeMap[pd.type] ||
      !pd.location
    ) {
      return res.status(400).json({ error: 'Missing or invalid required pet details for creating pet.' });
    }

    const newPet = new Pet({
      name: pd.name,
      age: {
        value: pd.age.value,
        unit: pd.age.unit
      },
      breed: pd.breed,
      gender: pd.gender,
      neutered: pd.neutered,
      location: pd.location,
      image: existingRequest.images?.[0] || null,
      upForAdoption: true,
      type: typeMap[pd.type]
    });
    await newPet.save();

    res.status(200).json({
      success: true,
      message: 'Post request approved and pet added!',
      request: existingRequest
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/:id/reject', async (req, res) => {
  try {
    const requestId = req.params.id;
    const existingRequest = await PostRequest.findById(requestId);
    
    if (!existingRequest) {
      return res.status(404).json({ error: 'Post request not found' });
    }

    existingRequest.status = 'rejected';
    await existingRequest.save();

    res.status(200).json({
      success: true,
      message: 'Post request rejected!',
      request: existingRequest
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create PostRequest route
router.post('/', upload.array('petPhotos', 5), async (req, res) => {
  try {
    // Convert ageValue to number
    const ageValue = parseInt(req.body.ageValue);
    if (isNaN(ageValue)) {
      throw new Error('Age must be a number');
    }

    const newRequest = new PostRequest({
      petDetails: {
        name: req.body.name,
        age: {
          value: ageValue,
          unit: req.body.ageUnit
        },
        gender: req.body.gender,
        neutered: req.body.neutered,
        breed: req.body.breed,
        type: req.body.type,
        location: req.body.location,
        healthInfo: {
          hasDisease: req.body.petDisease,
          medication: req.body.petMedication || null
        },
        behavior: {
          goodWithChildren: req.body.petWithOthers,
          notes: req.body.petExtraInfo || ''
        }
      },
      ownerDetails: {
        name: req.body.ownerName,
        phone: req.body.ownerPhone,
        email: req.body.ownerEmail
      },
      homePreferences: req.body.petHomePref || '',
      images: req.files ? req.files.map(file => `/uploads/post-requests/${file.filename}`) : []
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Post request submitted successfully!',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating post request:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;