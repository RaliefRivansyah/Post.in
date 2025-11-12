'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Comments', [
            // Comments for Post 1 (My First Blog Post)
            {
                postId: 1,
                userId: 3,
                content: 'Welcome to the platform! Great to have you here 👋',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 1,
                userId: 1,
                content: 'Nice intro post! Looking forward to your future content.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Comments for Post 2 (Amazing Sunset Photography)
            {
                postId: 2,
                userId: 2,
                content: 'That sunset looks absolutely stunning! 🌅',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 2,
                userId: 1,
                content: 'Amazing shot! What camera did you use?',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 2,
                userId: 3,
                content: 'The colors are incredible! Mother nature at its finest.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Comments for Post 3 (Quick update)
            {
                postId: 3,
                userId: 1,
                content: "Glad to hear you're having a great day!",
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Comments for Post 4 (Tips for Better Productivity)
            {
                postId: 4,
                userId: 2,
                content: 'Great tips! I especially love the Pomodoro technique.',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 4,
                userId: 3,
                content: 'I would add "exercise regularly" to this list. It really helps!',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 4,
                userId: 2,
                content: 'Sleep is so underrated. Thanks for the reminder!',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Comments for Post 5 (Coffee time)
            {
                postId: 5,
                userId: 1,
                content: "Always! Can't function without my morning coffee ☕",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 5,
                userId: 2,
                content: 'Coffee is life! ☕❤️',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // Comments for Post 6 (Learning JavaScript)
            {
                postId: 6,
                userId: 2,
                content: 'Congratulations! 30 days is a huge milestone 🎉',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 6,
                userId: 3,
                content: "This is so inspiring! I'm on day 5 of my JavaScript journey.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: 6,
                userId: 1,
                content: 'Keep it up! The learning never stops in programming 💻',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Comments', null, {});
    },
};
