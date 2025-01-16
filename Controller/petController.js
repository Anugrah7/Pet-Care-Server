const addedPet = require('../models/petModel');
const { v4: uuidv4 } = require('uuid'); // For generating unique pet IDs

exports.addPetController = async (req, res) => {
    console.log('Inside addPetController');
    const userId = req.userId; // Assuming middleware sets req.userId after JWT validation
    console.log('User ID:', userId);
    console.log('Request Body:', req.body);

    const { petName, petType, age, medicalHistory, petImage } = req.body;

    // Check if all fields are provided
    if (!petName || !petType || !age || !medicalHistory || !petImage) {
        return res.status(400).json('All fields are required to add a pet.');
    }

    try {
        // Generate a unique pet ID
        const petId = uuidv4();

        // Create a new pet
        const newPet = new addedPet({
            petName,
            petType,
            age,
            medicalHistory,
            petImage, // Cloudinary URL
            petId,
            ownerId: userId,
        });

        // Save the pet to the database
        await newPet.save();

        res.status(201).json({
            message: 'Pet added successfully!',
            pet: newPet,
        });
    } catch (err) {
        console.error('Error while adding pet:', err);
        res.status(500).json('An error occurred while adding the pet.');
    }
};


exports.getPetController = async (req, res) => {
    console.log("Inside getPetController");
    try {

        const {petId} = req.params;

         if (petId) {
            // If petId is provided, fetch the specific pet
            const pet = await addedPet.findOne({ petId: petId });
            
            if (!pet) {
                return res.status(404).json({ message: "Pet not found" });
            }
            
            console.log("Pet retrieved from database:", pet); // Log the retrieved pet
            return res.status(200).json(pet); // Return the pet details
        } else {
            // If no petId is provided, fetch all pets
            const allPet = await addedPet.find();
            console.log("Pets retrieved from database:", allPet); // Log the retrieved pets
            return res.status(200).json(allPet); // Return all pets
        }
    } catch (err) {
        console.error("Error fetching pets:", err); // Log the error
        res.status(500).json("An error occurred while fetching pets.");
    }
};

exports.removePetController = async (req, res) => {
    console.log("Inside removePetController");
    const {_id} = req.params;

    try{
        const removePet = await addedPet.findByIdAndDelete((_id));
        if (!removePet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json(removePet)
    
    }catch(err){
        console.error("Error removing pet:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}
