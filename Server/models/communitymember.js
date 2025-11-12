'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CommunityMember extends Model {
        static associate(models) {
            CommunityMember.belongsTo(models.Community, { foreignKey: 'communityId' });
            CommunityMember.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    CommunityMember.init(
        {
            communityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: 'member',
            },
        },
        {
            sequelize,
            modelName: 'CommunityMember',
            tableName: 'CommunityMembers',
        }
    );
    return CommunityMember;
};
