const express = require("express"); // Get express library
const app = express(); // Initialize express to make API requests
const cors = require("cors");

app.use(express.json()); // Parses in form of json
app.use(cors()); // Whitelist api so connection works and make request on your computer

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts"); // Access router for posts
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments"); // Access router from comments
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users"); // Access router from users
app.use("/auth", usersRouter);
const reportRouter = require("./routes/Reports"); // Access router from reports
app.use("/reports", reportRouter);
const likesRouter = require("./routes/Likes"); // Access router from likes
app.use("/likes", likesRouter);
const dislikesRouter = require("./routes/Dislikes"); // Access router from likes
app.use("/dislikes", dislikesRouter);

db.sequelize.sync().then(() => { 
  app.listen(3001, () => { // use localhost:3001
    console.log("Server running on port 3001");
  });
});
