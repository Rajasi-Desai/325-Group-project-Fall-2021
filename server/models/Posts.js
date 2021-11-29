module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, { // Get all comments from db associated with given post
      onDelete: "cascade", // If post is deleted, then all comments on post get deleted
    });
    
    Posts.hasMany(models.Likes, { // Get all likes from db associated with given post
      onDelete: "cascade", // If post is deleted, then all comments on post get deleted
    });
  }

  return Posts;
};
