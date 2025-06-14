
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
    console.log('Fetched requests:', requests); // Debug log
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
    console.log('Fetched requests:', requests); // Debug log
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/post-requests/:id/approve', upload.array('images', 5), async (req, res) => {
  try {
    const requestId = req.params.id;
    const existingRequest = await PostRequest.findById(requestId);
    
    if (!existingRequest) {
      return res.status(404).json({ error: 'Post request not found' });
    }

    // Update the status to approved
    existingRequest.status = 'approved';
    
    // Optionally update other fields if provided
    if (req.body.name) existingRequest.petDetails.name = req.body.name;
    if (req.body.ageValue && req.body.ageUnit) {
      existingRequest.petDetails.age = {
        value: parseInt(req.body.ageValue),
        unit: req.body.ageUnit
      };
    }
    if (req.body.gender) existingRequest.petDetails.gender = req.body.gender;
    if (req.body.neutered) existingRequest.petDetails.neutered = req.body.neutered;
    if (req.body.breed) existingRequest.petDetails.breed = req.body.breed;
    if (req.body.type) existingRequest.petDetails.type = req.body.type;
    if (req.body.location) existingRequest.petDetails.location = req.body.location;
    if (req.body.petDisease) existingRequest.petDetails.healthInfo.hasDisease = req.body.petDisease;
    if (req.body.petMedication) existingRequest.petDetails.healthInfo.medication = req.body.petMedication;
    if (req.body.petWithOthers) existingRequest.petDetails.behavior.goodWithChildren = req.body.petWithOthers;
    if (req.body.petExtraInfo) existingRequest.petDetails.behavior.notes = req.body.petExtraInfo;
    if (req.body.ownerName) existingRequest.ownerDetails.name = req.body.ownerName;
    if (req.body.ownerPhone) existingRequest.petDetails.ownerPhone = req.body.ownerPhone;
    if (req.body.ownerEmail) existingRequest.ownerDetails.email = req.body.ownerEmail;
    if (req.body.petHomePref) existingRequest.homePreferences = req.body.petHomePref;
    if (req.files && req.files.length) {
      existingRequest.images = req.files.map(file => `/uploads/post-requests/${file.filename}`);
    }

    await existingRequest.save();

    // Create a new Pet document if approved
    const newPet = new Pet({
      name: existingRequest.petDetails.name,
      age: existingRequest.petDetails.age,
      gender: existingRequest.petDetails.gender,
      neutered: existingRequest.petDetails.neutered,
      breed: existingRequest.petDetails.breed,
      type: existingRequest.petDetails.type,
      location: existingRequest.petDetails.location,
      upForAdoption: true,
      image: existingRequest.images[0] || null
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

router.post('/admin/post-requests/:id/reject', async (req, res) => {
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
