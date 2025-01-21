const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  services: [{ type: String }],  // Change this to String (no ObjectId)
  role: { type: String, enum: ['owner', 'provider'], default: 'provider' },
});

module.exports = mongoose.model('Provider', providerSchema);
