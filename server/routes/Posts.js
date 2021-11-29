const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Posts, Likes } = require("../models"); // Get instance of Posts in models folder
const {validateToken} = require("../middlewares/AuthMiddleware");

// Write requests here for posts

// GET Request (Gets all post from database)
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll( {include: [Likes]} ); // Get posts from table (plus their likes)
  const likedPosts = await Likes.findAll({where: {UserId: req.user.id}}); // Get all likes from table for given user
  res.json({listOfPosts: listOfPosts, likedPosts: likedPosts}); // Return list of posts and likes in response in form of json
});

// GET Request (Get post with specific id)
router.get('/byId/:id', async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

// GET Request (Get LIST of posts from specific USER id, plus the likes from each post)
router.get('/byuserId/:id', async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({ 
    where: {UserId: id},
    include: [Likes], 
  });
  res.json(listOfPosts);
});

// POST Request (Create post and add it to database)
router.post("/", validateToken, async (req, res) => {
  const post = req.body; // Access data from req.body
  post.username = req.user.username; // Get username
  post.UserId = req.user.id; // Get userId
  await Posts.create(post); // Adds post data into database (await to make sure all data is inserted into database before proceeding)
  res.json(post); // Return response in form of json
});

// PUT Request (Update title of post)
router.put("/title", validateToken, async (req, res) => {
  const {newTitle, id} = req.body;
  await Posts.update({title: newTitle}, {where: {id: id}}); // Update post table in db with new title, given id
  res.json(newTitle);
});

// PUT Request (Update content/text of post)
router.put("/postText", validateToken, async (req, res) => {
  const {newText, id} = req.body;
  await Posts.update({postText: newText}, {where: {id: id}}); // Update post table in db with new text, given id
  res.json(newText);
});

module.exports = router; // Need to access router via server/index.js
