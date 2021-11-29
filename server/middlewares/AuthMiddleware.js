
const {verify} = require("jsonwebtoken");

// req = request (get), res = response (send/post), next = want request to move forward
const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken"); // Get accessToken from login

    if (!accessToken) { // If no accessToken received,
        return res.json({error: "User not logged in!"});
    }

    try { // Try to grab valid token
        const validToken = verify(accessToken, "importantsecret"); // Check if token is valid
        req.user = validToken; // Set user variable in request
        if (validToken) {
            return next(); // If so, move on with request
        }
    } catch (err) {
        return res.json({error: err}); // Otherwise, catch error for invalid token
    }
};

module.exports = {validateToken};