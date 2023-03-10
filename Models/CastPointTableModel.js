const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CastPointTableModel = sequelize.define(
    "CastPointTableModel",

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
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Cast Point   will have Name" },
          notEmpty: { msg: "Cast Point  will not be empty" },
        },
      },
      Rank: { type: DataTypes.BIGINT },
      BonusPoint: { type: DataTypes.BIGINT },
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
  return CastPointTableModel;
};
