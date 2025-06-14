const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController.js');
const multer = require('multer');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Image upload config
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

// GET pets with filters (for API)
router.get('/', petController.getPets);

// GET all pets (admin)
router.get('/all', petController.getAllPets);

// GET adopted pets (admin)
router.get('/adopted', petController.getAdoptedPets);

// POST new pet (with image upload)
router.post('/', upload.single('image'), petController.createPet);

// PUT update pet
router.put('/:id', upload.single('image'), petController.updatePet);

// GET single pet by id
router.get('/:id', petController.getPetById);

// DELETE pet by id
router.delete('/:id', petController.deletePet);

module.exports = router;