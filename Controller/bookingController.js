const Booking = require('../models/bookingsModel'); 
const User = require('../models/userModel'); 


exports.addbookingController = async (req, res) => {
    console.log('Inside addbookingController');
    const ownerId = req.userId;  // Assuming JWT middleware extracts the ownerId
    console.log('Owner ID:', ownerId);
    console.log('Request Body:', req.body);

    // Get services, date, and bookingStatus from request body
    const { service, date, bookingStatus, providerId } = req.body;

    // Validate input
    if (!service || !date) {
        console.error('Missing required fields: service or date');
        return res.status(400).json('All fields are required for booking.');
    }

    // Ensure that service is an array of strings (if multiple services)
    if (!Array.isArray(service)) {
        console.error('Service must be an array.');
        return res.status(400).json('Invalid service format. Services should be an array of strings.');
    }

    // Ensure that all elements in the service array are strings
    if (service.some(s => typeof s !== 'string')) {
        console.error('Each service must be a string.');
        return res.status(400).json('Each service must be a string.');
    }

    try {
        // Log the services being searched
        console.log('Services being searched:', service);
        console.log('Type of services:', Array.isArray(service));

        let provider;
        if (providerId) {
            provider = await User.findOne({ _id: providerId, services: { $all: service }, role: 'provider' });
            if (!provider) {
                return res.status(404).json('Invalid provider or services.');
            }
        } else {
            provider = await User.findOne({ services: { $all: service }, role: 'provider' });
            if (!provider) {
                console.error('No provider found for services:', service);
                return res.status(404).json('No provider found for the requested services.');
            }
        }

        // Log the provider found
        console.log('Provider found:', provider);

        // Create a new booking with the array of services
        const newBooking = new Booking({
            service, // Store service as an array of strings
            providerId: provider._id,  // Set the providerId to the found provider
            ownerId,                   // Set the ownerId to the current logged-in owner
            date,
            bookingStatus: bookingStatus || 0, // Default to Pending
        });

        await newBooking.save();

        // Respond with success message
        res.status(201).json({
            message: 'Booking added successfully!',
            booking: newBooking,
        });
    } catch (err) {
        console.error('Error while adding booking:', err);
        res.status(500).json('An error occurred while adding the booking.');
    }
};

exports.getProvidersByServicesController = async (req, res) => {
    const { service } = req.body;
    if (!service || !Array.isArray(service) || service.length === 0) {
        return res.status(400).json('Services are required and must be an array.');
    }
    try {
        const providers = await User.find({ role: 'provider', services: { $all: service } });
        if (!providers.length) {
            return res.status(404).json('No matching providers found.');
        }
        res.status(200).json(providers);
    } catch (err) {
        res.status(500).json('Error fetching providers.');
    }
};

exports.getbookingController = async (req, res) => {
    console.log("Inside getbookingController");
    const providerId = req.userId;  // Assuming JWT middleware sets req.userId
    console.log('Provider ID:', providerId);

    try {
        // Fetch all bookings for the logged-in provider
        const allBookings = await Booking.find({ providerId: providerId });

        if (!allBookings || allBookings.length === 0) {
            return res.status(404).json('No bookings found for this provider.');
        }

        console.log("Bookings retrieved from database:", allBookings);
        res.status(200).json(allBookings);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json("An error occurred while fetching bookings.");
    }
};

