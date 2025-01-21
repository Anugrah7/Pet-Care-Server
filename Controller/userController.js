const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//register

const Services = require('../models/serviceSchema'); // Assuming you have a Service model

exports.registerController = async (req, res) => {
    const { username, email, password, role, services } = req.body;

    try {
        // Log input for debugging
        console.log("Request Data:", req.body);

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(406).json("User already exists. Please login.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let serviceIds = [];
        if (role === 'provider' && services && services.length > 0) {
            // Log services for debugging
            console.log("Requested Services:", services);

            // Fetch service IDs based on service names
            const matchedServices = await Services.find({ name: { $in: services } });
            console.log("Matched Services:", matchedServices);

            // Map service names to IDs
            serviceIds = matchedServices.map(service => service._id);

            // Log IDs for debugging
            console.log("Service IDs:", serviceIds);

            // Check if all services were found
            if (serviceIds.length !== services.length) {
                return res.status(400).json("Some services provided are invalid.");
            }
        }

        // Create a new user
        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
            role,
            services: role === 'provider' ? serviceIds : [], // Use service IDs for providers
        });

        // Save the new user to the database
        await newUser.save();
        res.status(200).json(newUser);
    } catch (err) {
        // Log the error
        console.error("Error during registration:", err);
        res.status(500).json('An error occurred while registering the user.');
    }
};


exports.loginController = async (req, res) => {
    console.log("loginController");
    const { email, password, role } = req.body; // Expect 'role' in the request
    console.log(email, password, role);

    try {


        const existingUser = await Users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json("Invalid Email or Password");
        }
        if (!role) {
            return res.status(400).json("Role is required.");
        }
        
        // Check if the role matches
        if (existingUser.role !== role) {
            return res.status(403).json("Access denied. Invalid role for this user.");
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(404).json("Invalid Email or Password");
        }

        // Generate token
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role }, 
            process.env.JWTPASSWORD
        );
        res.status(200).json({ user: existingUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json('An error occurred during login.');
    }
};


