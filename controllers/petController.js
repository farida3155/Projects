const Pet = require('../models/petSchema.js');
const mongoose = require('mongoose');

exports.getPets = async (req, res) => {
    const filter = { upForAdoption: true };
    const { name, gender, breed, neutered, location, type, ageValue, ageUnit } = req.query;
    if (name) filter.name = name;
    if (ageValue && ageUnit) {
        filter['age.value'] = ageValue;
        filter['age.unit'] = ageUnit;
    }
    if (gender) filter.gender = gender;
    if (breed) filter.breed = breed;
    if (neutered) filter.neutered = neutered;
    if (location) filter.location = location;
    if (type) filter.type = type; 
    try {
        const petList = await Pet.find(filter).select('name age breed gender neutered location image type');
        res.status(200).send(petList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.getAllPets = async (req, res) => {
    try {
        const petList = await Pet.find();
        res.status(200).send(petList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.getAdoptedPets = async (req, res) => {
    try {
        const adoptedPets = await Pet.find({ upForAdoption: false });
        res.status(200).send(adoptedPets);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.createPet = async (req, res) => {
    let imagePath = '';
    if (req.file) {
        const fileName = req.file.filename;
        imagePath = `/uploads/${fileName}`;
    }
    let age = { value: '', unit: '' };
    if (req.body.age) {
        try { age = JSON.parse(req.body.age); } catch (e) {}
    } else {
        age.value = req.body.ageValue;
        age.unit = req.body.ageUnit;
    }
    let upForAdoption = req.body.upForAdoption;
    if (typeof upForAdoption === "string") {
        upForAdoption = upForAdoption === 'true';
    }
    let pet = new Pet({
        name: req.body.name,
        age,
        breed: req.body.breed,
        gender: req.body.gender,
        neutered: req.body.neutered,
        location: req.body.location,
        image: imagePath,
        upForAdoption,
        type: req.body.type,
    });
    try {
        pet = await pet.save();
        if (!pet) return res.status(500).send('Pet could not be added!');
        res.send(pet);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.updatePet = async (req, res) => {
    let imagePath;
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }
    let age = { value: '', unit: '' };
    if (req.body.age) {
        try { age = JSON.parse(req.body.age); } catch (e) {}
    } else {
        age.value = req.body.ageValue;
        age.unit = req.body.ageUnit;
    }
    let upForAdoption = req.body.upForAdoption;
    if (typeof upForAdoption === "string") {
        upForAdoption = upForAdoption === 'true';
    }
    const updateData = {
        name: req.body.name,
        age,
        breed: req.body.breed,
        gender: req.body.gender,
        neutered: req.body.neutered,
        location: req.body.location,
        upForAdoption,
        type: req.body.type,
    };
    if (imagePath) updateData.image = imagePath;
    try {
        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!pet) return res.status(404).json({ success: false });
        res.send(pet);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet Not Found!' });
        }
        res.status(200).send(pet);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};

exports.deletePet = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid Pet ID' });
    }
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (pet) {
            return res.status(200).json({ success: true, message: 'Pet has been removed!' });
        } else {
            return res.status(404).json({ success: false, message: 'Pet Not Found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};