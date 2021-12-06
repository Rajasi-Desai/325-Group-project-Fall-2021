const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Dislikes } = require("../models"); // Get instance of Posts in models folder
const { validateToken } = require("../middlewares/AuthMiddleware"); // Get validateToken

// GET request (Get dislike of post based on user)


// POST request (Add/Remove dislike to post)
router.post("/", validateToken, async (req, res) => {
    const {PostId} = req.body;
    const UserId = req.user.id;
    
    const found = await Dislikes.findOne({ where: { PostId: PostId, UserId: UserId } }); // Check if there is a like already
    if (!found) {
        await Dislikes.create({PostId: PostId, UserId: UserId}); // If dislike is not found (doesn't exist already), then add dislike to db
        res.json({disliked: true});
    } else {
        await Dislikes.destroy({
            where: { PostId: PostId, UserId: UserId }, // Otherwise, remove dislike from db
        });
        res.json({disliked: false});
    };
});

module.exports = router; // Need to access router via server/index.js