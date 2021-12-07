const express = require("express"); // Get express
const router = express.Router(); // Access router from express
const { Reports } = require("../models"); // Get instance of Reports in models folder
const {validateToken} = require("../middlewares/AuthMiddleware");

// Write requests here for reports

// GET Request (Gets all reports from database)
router.get("/", async (req, res) => {
    const listOfReports = await Reports.findAll(); // Get every element from table
    res.json(listOfReports); // Return response in form of json
});

// GET Request (Gets all reports from database by postId)
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId; // Get Id of post
    const listOfReports = await Reports.findAll({ where: { PostId: postId } }); // Get reports with postId from table
    res.json(listOfReports); // Return response in form of json
});

// GET Request (Gets all reports from database by userId)
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId; // Get Id of user
  const listOfReports = await Reports.findAll({ where: { UserId: userId } }); // Get reports with userId from table
  res.json(listOfReports); // Return response in form of json
});

// POST Request (Make/File report and add it to database)
router.post("/", validateToken, async (req, res) => {
  const report = req.body.details; // Access data from req.body
  report.PostId = req.body.postId; // Get postId
  report.UserId = req.user.id; // Get userId
  await Reports.create(report); // Add report data into database (await to make sure all data is inserted into database before proceeding)
  res.json(report); // Return response in form of json
});

module.exports = router; // Need to access router via server/index.js
