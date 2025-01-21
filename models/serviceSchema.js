const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the service (e.g., Grooming, Training)
  description: { type: String },         // Optional description of the service
  price: { type: Number },               // Optional price for the service
});

module.exports = mongoose.model('Service', serviceSchema);
