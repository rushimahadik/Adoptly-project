const mongoose = require('mongoose');

const VolunteerApplicationSchema = new mongoose.Schema({
    name: String,
    dob: String,
    phone: Number,
    email: String,
    address: String,
    days: String,
    hours: String,
    experience: String,
    tasks: String,
    health: String,
    whyVolunteer: String,
    previousVolunteer: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VolunteerApplication", VolunteerApplicationSchema);

