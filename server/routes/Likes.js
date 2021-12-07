const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Likes } = require("../models"); // Get instance of Posts in models folder
const { validateToken } = require("../middlewares/AuthMiddleware"); // Get validateToken

// POST request (Add/Remove like to post)
router.post("/", validateToken, async (req, res) => {
    const {PostId} = req.body;
    const UserId = req.user.id;
    
    const found = await Likes.findOne({ where: { PostId: PostId, UserId: UserId } }); // Check if there is a like already
    if (!found) {
        await Likes.create({PostId: PostId, UserId: UserId}); // If like is not found (doesn't exist already), then add like to db
        res.json({liked: true});
    } else {
        await Likes.destroy({
            where: { PostId: PostId, UserId: UserId }, // Otherwise, remove like from db
        });
        res.json({liked: false});
    };
});

module.exports = router; // Need to access router via server/index.js