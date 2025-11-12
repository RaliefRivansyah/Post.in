'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Like.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
    }
  }

  Like.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
    }
  );

  return Like;
};
