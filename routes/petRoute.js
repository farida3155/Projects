const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController.js');
const multer = require('multer');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Uploading images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type!');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(/\s+/g, '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const upload = multer({ storage: storage });

// filter pets
router.get('/', petController.getPets);

// ADMIN display all pets
router.get('/all', petController.getAllPets);

// ADMIN display adopted pets by id
router.get('/adopted', petController.getAdoptedPets);

// Add new pet
router.post('/', upload.single('image'), petController.createPet);

// Update pet
router.put('/:id', upload.single('image'), petController.updatePet);

// Get pet by id
router.get('/:id', petController.getPetById);

// Delete pet by id
router.delete('/:id', petController.deletePet);

module.exports = router;