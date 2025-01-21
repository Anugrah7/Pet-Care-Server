const Services = require ('../models/serviceSchema')


exports.getServicesController = async (req, res) => {
    console.log("Inside getServicesController");
    try {
        const userRole = req.role; // Extract role from middleware
        console.log(`Fetching services for role: ${userRole}`);

        // Fetch services based on user role or ID
        const services = userRole === 'provider'
            ? await Services.find({ providerId: req.userId }) // Provider-specific services
            : await Services.find(); // Public services for owners

        res.status(200).json(services);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json("An error occurred while fetching services.");
    }
};
