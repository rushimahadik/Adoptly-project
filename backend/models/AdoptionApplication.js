const mongoose = require('mongoose');

const adoptionapplicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    reason: String,
    household_agreement: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdoptionApplication', adoptionapplicationSchema);
