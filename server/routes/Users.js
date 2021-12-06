const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Users } = require("../models"); // Get instance of Users in models folder
const bcrypt = require("bcrypt");
const {validateToken} = require("../middlewares/AuthMiddleware");
const {sign} = require('jsonwebtoken');

// Write requests here for User

// POST Request (Register User)
router.post("/", async (req, res) => {
    const {username, email, password} = req.body; // Get username, emailand password from request
    bcrypt.hash(password, 10).then((hash) => { // Hash original password for encryption purpose
        Users.create({
            username: username, 
            email: email, 
            password: hash,
        });
        res.json("Registration SUCCESS");
    }); 
});

// POST Request (Login)
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    const user = await Users.findOne({ where: {username: username}}); // Get user with username from db
    
    if (!user) res.json({error: "User does not exist"});
    
    bcrypt.compare(password, user.password).then((match) => { // Compare password from db to password converted from input
        if (!match) res.json({error: "Incorrect password"});

        // Once login is authenticated, create access token
        const accessToken = sign(
            {username: user.username, id: user.id}, 
            "importantsecret"
        );
        res.json({token: accessToken, username: username, id: user.id});
    }); 
});

// GET Request (Validates token to ensure that it is not fake or made-up by returning user data)
router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

// GET Request (Get basic information of the user for the profile page)
router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id; // Get id of user
    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    }); // Get basic info of user based on primary key (pk), excluding password
    res.json(basicInfo);
});

// PUT Request (Change password in db for given user)
router.put("/changepassword", validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body; // Get old password and new password from ChangePassword.js
    const user = await Users.findOne({ where: { username: req.user.username } }); // Get user with username from db (username is assigned in validateToken)
   
    bcrypt.compare(oldPassword, user.password).then(async (match) => { // Compare password from db to old password converted from input
        if (!match) res.json({error: "Wrong old password"}); // If old password doesn't match to what is in db, throw error

        // Once login is authenticated, use new password, encrypt it, and update
        bcrypt.hash(newPassword, 10).then((hash) => { // Hash new password for encryption purpose
            Users.update(
                {password: hash}, 
                {where: {username: req.user.username}},
            );
            res.json("Password Updated!");
        }); 
    }); 
});

module.exports = router; // Need to access router via server/index.js
