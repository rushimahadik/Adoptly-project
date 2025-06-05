// routes/adoptionRequests.js
const express = require('express');
const router = express.Router();
const AdoptionApplication = require('../models/AdoptionApplication');

// GET all adoption applications (for admin dashboard)
router.get('/adoptionapplications', async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({status:'pending'});
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});


// PUT to approve or reject an application
router.put('/approveapplication/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const application = await AdoptionApplication.findById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Toggle approval (or use request body to determine action if needed)
    const newStatus = application.status === "approved" ? "rejected" : "approved";
    application.status = newStatus;
    await application.save();

    res.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(500).json({ success: false, error: "Failed to update application status" });
  }
});

module.exports = router;
