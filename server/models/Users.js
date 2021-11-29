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
      Users.hasMany(models.Likes, { // Get all likes from db associated with given post
        onDelete: "cascade", // If post is deleted, then all comments on post get deleted
      });

      Users.hasMany(models.Posts, { // Get all posts from db associated with given post
        onDelete: "cascade",
      });
    }
  
    return Users;
  };
  