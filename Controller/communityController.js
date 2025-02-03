const CommunityPost = require('../models/communitySchema')
const User = require('../models/userModel')


// Create a new community post
exports.createPost = async (req, res) => {
    try {
        const { question } = req.body;
        const ownerId = req.userId; // Extracted from JWT

        console.log("Creating post for user:", ownerId); // Debugging log

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        if (!ownerId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        // Check if user exists
        const userExists = await User.findById(ownerId);
        console.log("User found in DB:", userExists);

        if (!userExists) {
            return res.status(404).json({ message: 'User not found in database!' });
        }

        // Create and save post
        const newPost = new CommunityPost({
            question,
            owner: ownerId,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

  

// Fetch all community posts
// Fetch all community posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('owner', 'username') // Populate owner details (only username)
      .populate('comments.owner', 'username') // Populate comment owner's details
      .sort({ createdAt: -1 }); // Sort by latest posts first

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add a comment to a specific community post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from the URL
    const { text } = req.body; // Get the comment text from the request body
    const ownerId = req.userId; // Extracted from JWT (user ID)

    if (!text || !ownerId) {
      return res.status(400).json({ message: 'Comment text and User ID are required' });
    }

    // Find the post by its ID (_id)
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the new comment to the post
    const newComment = {
      text,
      owner: ownerId,
    };

    post.comments.push(newComment); // Add comment to the post's comments array
    await post.save(); // Save the updated post with the new comment

    res.status(201).json(post); // Return the updated post with the new comment
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
