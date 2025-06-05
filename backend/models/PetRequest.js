const mongoose = require('mongoose');

const PetRequestSchema = new mongoose.Schema({
    name: String,
    species: String,
    age: String,
    breed: String,
    gender: String,
    image: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submitedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('PetRequest', PetRequestSchema);