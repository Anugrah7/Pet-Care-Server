const Provider = require('../models/providerSchema');

exports.getProvidersController = async (req, res) => {
    console.log("Inside getProvidersController");
    try {
        const userRole = req.role; // Extract role from middleware
        console.log(`Fetching providers for role: ${userRole}`);

        

        // Fetch providers based on role or ID
        let providers;
        if (userRole === 'owner') {
            // Owners can see all providers
            providers = await Provider.find({ role: 'provider' }); 
        } else if (userRole === 'provider') {
            // Providers can only see their own information
            providers = await Provider.find({ _id: req.userId }); 
        } else {
            return res.status(403).json("Unauthorized access.");
        }

        // Send the list of providers as response
        res.status(200).json(providers);
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json("An error occurred while fetching providers.");
    }
};
