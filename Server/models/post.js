'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
            Post.belongsTo(models.Community, { foreignKey: 'communityId', onDelete: 'CASCADE' });
            Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
            Post.hasMany(models.Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
        }
    }

    Post.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: DataTypes.TEXT,
            imageUrl: DataTypes.STRING,
            videoUrl: DataTypes.STRING,
            mediaType: {
                type: DataTypes.ENUM('image', 'video'),
                allowNull: true,
                defaultValue: 'image',
            },
            communityId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Post',
            tableName: 'Posts',
        }
    );

    return Post;
};
