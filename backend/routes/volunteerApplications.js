const express = require('express');
const router = express.Router();
const VolunteerApplication = require('../models/VolunteerApplication');

// GET all volunteer applications
router.get('/volunteerapplications', async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({status:'pending'});
    res.json(applications);
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    res.status(500).json({ error: 'Failed to fetch volunteer applications' });
  }
});

// PUT to update status (approve or reject)
router.put('/volunteerapplications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Volunteer application not found' });
    }

    res.json({ success: true, updated });
  } catch (err) {
    console.error('Error updating volunteer status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
