'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Profiles', [
            {
                userId: 1,
                bio: 'Administrator of the platform. Love coding and building amazing things! 💻',
                avatarUrl: 'https://i.pravatar.cc/150?img=1',
                location: 'Jakarta, Indonesia',
                website: 'https://admin.dev',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                bio: 'Casual poster and commenter. Living life one day at a time 🌟',
                avatarUrl: 'https://i.pravatar.cc/150?img=2',
                location: 'Bandung, Indonesia',
                website: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                bio: 'Photography enthusiast 📸 | Capturing moments | Nature lover 🌿',
                avatarUrl: 'https://i.pravatar.cc/150?img=3',
                location: 'Surabaya, Indonesia',
                website: 'https://photo.me',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Profiles', null, {});
    },
};
