const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const PointTableSystemModel = sequelize.define(
    "PointTableSystemModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: [["Pick", "Cast"]],
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have ShortCode" },
          notEmpty: { msg: "ShortCode  will not be empty" },
        },
      },
      Length: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Group_Name: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Group Name" },
          notEmpty: { msg: "Group Name Point will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return PointTableSystemModel;
};
