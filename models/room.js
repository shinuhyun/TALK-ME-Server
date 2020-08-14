'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
      this.hasMany(models.Question, {
        as: 'questions', // alias 적용
        foreignKey: 'roomId',
        onDelete: 'cascade',
      });
    }
  }
  Room.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Room',
    }
  );
  return Room;
};
