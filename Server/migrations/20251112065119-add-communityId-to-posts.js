'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Posts', 'communityId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Communities',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Posts', 'communityId');
    },
};
