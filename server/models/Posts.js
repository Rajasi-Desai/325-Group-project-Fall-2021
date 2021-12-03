module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postType: {
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
    // PostId for given comment (which post is the comment for)
    Posts.hasMany(models.Comments, { // Get all comments from db associated with given post
      onDelete: "cascade", // If post is deleted, then all comments on post get deleted
    });
    
    // PostId for given like (who liked which post)
    Posts.hasMany(models.Likes, { // Get all likes from db associated with given post
      onDelete: "cascade", // If post is deleted, then all comments on post get deleted
    });

    // PostId for given report (which post is the report for)
    Posts.hasMany(models.Reports, { // Get all reports from db associated with given post
      onDelete: "cascade", // If post is deleted, then all comments on post get deleted
    });
  }

  return Posts;
};
