'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models) {
            Profile.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
        }
    }

    Profile.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            bio: DataTypes.TEXT,
            avatarUrl: DataTypes.STRING,
            location: DataTypes.STRING,
            website: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Profile',
            tableName: 'Profiles',
        }
    );

    return Profile;
};
