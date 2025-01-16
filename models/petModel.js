const mongoose = require ('mongoose')

const petSchema = new mongoose.Schema({
    petName:{
        type:String,
        required:true
    },
    petType:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    medicalHistory:{
        type:String,
        required:true
    },
    petImage:{
        type:String,
        required:true
    },
    petId:{
        type:String,
        required:true,
        unique:true
    },
    ownerId: { // Optional: Reference to the owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const addedPet = mongoose.model("addedPet",petSchema)
module.exports = addedPet