'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Comment.belongsTo(models.Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
    }
  }

  Comment.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments',
    }
  );

  return Comment;
};
