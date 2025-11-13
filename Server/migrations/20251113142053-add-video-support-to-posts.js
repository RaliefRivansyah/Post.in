'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Posts', 'videoUrl', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Posts', 'mediaType', {
            type: Sequelize.ENUM('image', 'video'),
            allowNull: true,
            defaultValue: 'image',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Posts', 'videoUrl');
        await queryInterface.removeColumn('Posts', 'mediaType');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Posts_mediaType";');
    },
};
