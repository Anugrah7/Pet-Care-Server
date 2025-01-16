const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//register

exports.registerController = async(req,res)=>{
    console.log("Inside registerController");
    const {username,email,password,role} = req.body
    console.log(username,email,password,role);
    
    try{
        const extistingUser = await Users.findOne({email});
        if (extistingUser){
            return res.status(406).json("User already exists ... Please Login");
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new Users({
            username,email,password:hashedPassword,role
        });

        await newUser.save();
        res.status(200).json(newUser)
    } catch (err){
        console.error(err);
        res.status(500).json('An error Occured while Registering the user.');
    }
}

//login

// exports.loginController = async (req, res) => {
//     console.log("Inside LoginController");
//     const { email, password } = req.body;
//     console.log(email, password);

//     try {
//         // Check if user exists
//         const existingUser = await Users.findOne({ email });
//         if (!existingUser) {
//             return res.status(404).json("Invalid Email/Password");
//         }

//         // Compare passwords
//         const isPasswordValid = await bcrypt.compare(password, existingUser.password);
//         if (!isPasswordValid) {
//             return res.status(404).json("Invalid Email/Password");
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: existingUser._id },
//             process.env.JWTPASSWORD,
//             { expiresIn: '1h' } // Optional: Token expiration
//         );

//         // Respond with token and user details
//         res.status(202).json({
//             user: {
//                 username: existingUser.username,
//                 email: existingUser.email,
//                 role: existingUser.role
//             },
//             token
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json("An error occurred during login.");
//     }
// };

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


