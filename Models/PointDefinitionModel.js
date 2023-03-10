const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const PointDefinitionModel = sequelize.define(
    "PointDefinitionModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      PointGroupName: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      PointSystemid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      BonusPoint: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: [["Pick", "Cast"]],
      },
      BackupId: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return PointDefinitionModel;
};
