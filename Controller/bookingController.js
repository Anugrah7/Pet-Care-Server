const booking = require('../models/bookingsModel');


exports.addbookingController = async (req, res) => {
    console.log('Inside addbookingController');
    const userId = req.userId; // Assuming middleware sets req.userId after JWT validation
    console.log('User ID:', userId);
    console.log('Request Body:', req.body);
    const { service, provider, date, bookingStatus } = req.body;    
    if (!service || !provider || !date ) {
        console.log("service",service)
        console.log("provider",provider)
        console.log("date",date)
        console.log("bookingStatus",bookingStatus)

        return res.status(400).json('All fields are required for booking.');
    }
    try {
        // Create a new booking
        const newBooking = new booking({
            service: service,
            provider: provider,
            date:date,
            bookingStatus:bookingStatus,  
        });
        await newBooking.save();

        res.status(201).json({
            message: 'Booking  successfully!',
            booking: newBooking,
        });
    } catch (err) {
        console.error('Error while adding booking:', err);
        res.status(500).json('An error occurred while adding the booking.');
    }
};

exports.getbookingController = async (req, res) => {
    console.log("Inside getbookingController");
    try {
        const {  username } = req.body;      
           const allbooking = await booking.find({provider:username});
        console.log("bookings retrieved from database:", allbooking); // Add this log
        res.status(200).json(allbooking);
    } catch (err) {
        console.error("Error fetching bookings:", err); // Add this log
        res.status(500).json("An error occurred while fetching bookings.");
    }
};

