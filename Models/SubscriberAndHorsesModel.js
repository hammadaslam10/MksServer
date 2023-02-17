const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndHorsesModel = sequelize.define(
    "SubscriberAndHorsesModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      HorseModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      SubscriberModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return SubscriberAndHorsesModel;
};
