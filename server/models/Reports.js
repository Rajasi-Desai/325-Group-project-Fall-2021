module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define("Reports", {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    return Reports;
  };
  