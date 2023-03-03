const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ResultsModel = sequelize.define(
    "ResultsModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      RaceID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      RaceTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      HorseID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      BestTurnOut: {
        type: DataTypes.UUID,
        // allowNull: false,
        // defaultValue: "b9f11f0a-773b-431f-96b6-b2fb06f71172",
      },
      BestTurnPrice: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // defaultValue: "0",
      },
      BeatenBy: {
        type: DataTypes.UUID,
      },
      FinalPosition: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      TrainerOnRace: {
        type: DataTypes.UUID,
        // allowNull: false,
      },
      JockeyOnRace: {
        type: DataTypes.UUID,
        // allowNull: false,
      },
      PrizeWin: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Distance: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      CumulativeDistance: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      VideoLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return ResultsModel;
};
