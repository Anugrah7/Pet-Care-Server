const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//register

const Services = require('../models/serviceSchema'); // Assuming you have a Service model

exports.registerController = async (req, res) => {
    const { username, email, password, role, services } = req.body;

    try {
        console.log("Request Data:", req.body);

        // Check if user exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: "User already exists. Please login." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        

        // Process services only if the role is "provider"
        let serviceIds = [];
        if (role === "provider" && services && services.length > 0) {
            console.log("Requested Services:", services);

            const matchedServices = await Services.find({ name: { $in: services } });
            console.log("Matched Services:", matchedServices);

            serviceIds = matchedServices.map(service => service._id);

            if (serviceIds.length !== services.length) {
                return res.status(400).json({ message: "Some services provided are invalid." });
            }
        }

        // Create a new user
        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
            role,
            services: role === "provider" ? serviceIds : [],
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
        console.log("New user saved:", newUser);
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "An error occurred while registering the user." });
    }
};


exports.loginController = async (req, res) => {
    console.log("loginController");
    const { email, password, role } = req.body;
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

        // Log the correct user ID
        console.log("Logging in user ID:", existingUser._id.toString());

        // Generate token
        const token = jwt.sign(
            { userId: existingUser._id.toString(), role: existingUser.role }, 
            process.env.JWTPASSWORD
        );
        
        res.status(200).json({ user: existingUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json('An error occurred during login.');
    }
};
