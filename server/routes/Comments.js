const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Comments } = require("../models"); // Get instance of Comments in models folder
const {validateToken} = require("../middlewares/AuthMiddleware");

// Write requests here for comments

// GET request (Gets all comments for a given post's id)
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId; // Get Id of post
    const comments = await Comments.findAll({ where: { PostId: postId } }); // Find comments with Id
    res.json(comments);
});

// POST request (Make comment); goes through validateToken in middlewares/AuthMiddleware
router.post("/", validateToken, async (req, res) => {
    const comment = req.body; // Get data from comment
    const username = req.user.username; // Get username from AuthMiddleware.js
    comment.username = username; // Set username value in comment
    const newComment = await Comments.create(comment); // Create instance of comment
    res.json(newComment);
});

// DELETE request (Delete a comment user made)
router.delete("/:commentId", validateToken, async (req, res) => { // Include "validateToken" so that we ensure that user can ONLY delete their own comment
    const commentId = req.params.commentId; // Get id of comment to delete

    await Comments.destroy({ // Delete comment from database
        where: { 
            id: commentId,
        }, 
    });

    res.json("Deleted Successfully");
});

module.exports = router;