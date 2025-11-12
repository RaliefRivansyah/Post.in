'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Profiles', 'birthdate');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('Profiles', 'birthdate', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },
};
