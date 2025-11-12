'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Posts', [
            {
                userId: 2,
                title: 'My First Blog Post',
                content:
                    "Hello world! This is my first post here. I'm excited to join this community and share my thoughts with everyone. Looking forward to connecting with all of you and learning from your experiences. Let's make this journey amazing together!",
                imageUrl: 'https://picsum.photos/seed/first/800/400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                title: 'Amazing Sunset Photography',
                content:
                    'Captured this amazing sunset today at the beach. The colors were absolutely breathtaking - vibrant oranges, deep purples, and stunning pinks painted across the sky. Nature never fails to amaze me with its beauty. This moment reminded me why I love photography so much.',
                imageUrl: 'https://picsum.photos/seed/sunset/800/400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                title: 'Quick Daily Update',
                content:
                    "Just a quick update - having a great day! ☀️ The weather is beautiful and I'm feeling grateful for all the small things.",
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                title: 'Tips for Better Productivity',
                content:
                    'Here are my top 5 tips for staying productive:\n\n1. Start your day with a clear plan\n2. Take regular breaks (Pomodoro technique works great!)\n3. Minimize distractions - turn off notifications\n4. Stay hydrated and eat healthy\n5. Get enough sleep\n\nWhat are your productivity hacks? Share in the comments!',
                imageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                title: 'Morning Coffee Ritual',
                content:
                    "Coffee time! ☕ Anyone else need their morning caffeine fix? I can't start my day without a good cup of espresso. What's your favorite coffee drink?",
                imageUrl: 'https://picsum.photos/seed/coffee/600/400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                title: 'Learning JavaScript - Day 30',
                content:
                    "Just completed my 30-day JavaScript challenge! Started with the basics and now I can build interactive web applications. The journey wasn't easy, but consistency is key. For anyone starting out: don't give up, practice daily, build projects, and join coding communities. You got this! 💪",
                imageUrl: 'https://picsum.photos/seed/coding/800/400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Posts', null, {});
    },
};
