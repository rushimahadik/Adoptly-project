const express = require('express');
const router = express.Router();
const AdoptionApplication = require('../models/AdoptionApplication');

// GET all approved applications
router.get('/adoptionapplications/approved', async (req, res) => {
  try {
    const approved = await AdoptionApplication.find({ status: 'approved' });
    res.json(approved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch approved applications' });
  }
});

// DELETE a specific approved application by ID
router.delete('/approvedadoptions/:id', async (req, res) => {
  try {
    const deleted = await AdoptionApplication.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
