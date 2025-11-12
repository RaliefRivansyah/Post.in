'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Community extends Model {
        static associate(models) {
            Community.belongsTo(models.User, { foreignKey: 'creatorId', as: 'Creator' });
            Community.hasMany(models.Post, { foreignKey: 'communityId' });
            Community.belongsToMany(models.User, {
                through: models.CommunityMember,
                foreignKey: 'communityId',
                as: 'Members',
            });
        }
    }
    Community.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: DataTypes.TEXT,
            iconUrl: DataTypes.STRING,
            creatorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isPublic: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Community',
            tableName: 'Communities',
        }
    );
    return Community;
};
