const mongoose = require('mongoose');


const communityPostSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User collection
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Optional fields for future enhancements
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: String,
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  });

  const CommunityPost = mongoose.model('CommunityPost',communityPostSchema);

  module.exports = CommunityPost