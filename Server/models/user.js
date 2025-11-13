'use strict';
const bcrypt = require('bcryptjs');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
            User.hasMany(models.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
            User.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
            User.hasMany(models.Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
            User.hasMany(models.Community, { foreignKey: 'creatorId', as: 'CreatedCommunities' });
            User.belongsToMany(models.Community, {
                through: models.CommunityMember,
                foreignKey: 'userId',
                as: 'JoinedCommunities',
            });
        }

        // validasi password login
        async validPassword(password) {
            return bcrypt.compare(password, this.password);
        }
    }

    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: 'user',
            },
            googleId: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },
        }
    );

    return User;
};
