const mongoose = require ('mongoose')

const bookingSchema = new mongoose.Schema({
    service:{
        type:String,
        required:true
    },
    provider:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    bookingStatus:{
        type:Number,
        required:true,
    }
    
})

const Booking = mongoose.model("Booking",bookingSchema)
module.exports = Booking