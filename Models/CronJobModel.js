const Sequelize = require("sequelize");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  const CronJobModel = sequelize.define(
    "CronJobModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CronStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add CronStartTime Of Cron Job" },
          notEmpty: {
            msg: "Without CronStartTime Cron Job Will not get submitted",
          },
        },
      },
      CronEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RaceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return CronJobModel;
};
