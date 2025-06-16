const express = require('express');
const router = express.Router();
const Adoption = require('../../models/AdoptionForm');
const AcceptedForm = require('../../models/AcceptedForm');

// Get all adoption requests
router.get('/', async (req, res) => {
  try {
    const forms = await Adoption.find().sort({ date: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch adoption requests' });
  }
});

// Accept a form (move to AcceptedForm)
router.post('/accept/:id', async (req, res) => {
  try {
    const form = await Adoption.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const accepted = new AcceptedForm(form.toObject());
    await accepted.save();
    await form.deleteOne();

    res.json({ message: 'Form accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting form' });
  }
});

// Reject a form (delete from Adoption)
router.delete('/reject/:id', async (req, res) => {
  try {
    await Adoption.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form rejected and deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting form' });
  }
});

module.exports = router;
