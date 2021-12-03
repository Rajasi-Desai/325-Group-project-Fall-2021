module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Users.associate = (models) => {
      // Get UserId for likes
      Users.hasMany(models.Likes, { // Get all likes from db associated with given user
        onDelete: "cascade", // If post is deleted, then all comments on post get deleted
      });

      // Get UserId for posts
      Users.hasMany(models.Posts, { // Get all posts from db associated with given user
        onDelete: "cascade",
      });

      // Get UserId for reports
      Users.hasMany(models.Reports, { // Get all reports from db associated with given user
        onDelete: "cascade",
      });
    }
  
    return Users;
  };
  