const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    service: {
        type: [String],
        required: true, // E.g., 'grooming', 'veterinary checkup', etc.
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the provider in the User model
        ref: 'User',
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the owner in the User model
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true, // Appointment date
    },
    bookingStatus: {
        type: Number, // 0 = Pending, 1 = Confirmed, 2 = Completed, etc.
        required: true,
        default: 0, // Default to "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation timestamp
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
