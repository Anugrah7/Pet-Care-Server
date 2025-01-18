const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'provider'],
      required: true,
    },
    services: {
      type: [String], // This field will store the services the provider offers
      required: function() { return this.role === 'provider'; }, // Only required for providers
    }
  }, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
