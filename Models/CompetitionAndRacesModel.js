const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitionAndRacesModel = sequelize.define(
    "CompetitionAndRacesModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Competition: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Competition " },
          notEmpty: {
            msg: "Without Competition Races Will not get submitted",
          },
        },
      },
      Race: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Race Of Competition" },
          notEmpty: {
            msg: "Without Race Competion`s races Will not get submitted",
          },
        },
      },
      PointTableOfRace: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add PointTableOfRace Of Competition" },
          notEmpty: {
            msg: "Without PointTableOfRace Competition`s race Will not get submitted",
          },
        },
      },
      Publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return CompetitionAndRacesModel;
};
