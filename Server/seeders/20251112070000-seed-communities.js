'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const communities = [
            {
                name: 'Technology',
                description: 'All about the latest in tech, gadgets, and innovation',
                creatorId: 1,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Photography',
                description: 'Share your best shots and photography tips',
                creatorId: 2,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Cooking',
                description: 'Recipes, cooking tips, and food discussions',
                creatorId: 3,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Gaming',
                description: 'Video games, esports, and gaming culture',
                creatorId: 1,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Travel',
                description: 'Share your travel experiences and tips',
                creatorId: 2,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('Communities', communities);

        // Get the created community IDs
        const createdCommunities = await queryInterface.sequelize.query(`SELECT id, "creatorId" FROM "Communities" ORDER BY id ASC;`);

        const rows = createdCommunities[0];

        // Auto-join creators as admins
        const memberships = rows.map((row) => ({
            communityId: row.id,
            userId: row.creatorId,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        // Add some additional members (users 1, 2, 3 join various communities)
        memberships.push(
            // User 1 joins Photography and Cooking
            { communityId: rows[1].id, userId: 1, role: 'member', createdAt: new Date(), updatedAt: new Date() },
            { communityId: rows[2].id, userId: 1, role: 'member', createdAt: new Date(), updatedAt: new Date() },
            // User 2 joins Technology and Gaming
            { communityId: rows[0].id, userId: 2, role: 'member', createdAt: new Date(), updatedAt: new Date() },
            { communityId: rows[3].id, userId: 2, role: 'member', createdAt: new Date(), updatedAt: new Date() },
            // User 3 joins Technology and Travel
            { communityId: rows[0].id, userId: 3, role: 'member', createdAt: new Date(), updatedAt: new Date() },
            { communityId: rows[4].id, userId: 3, role: 'member', createdAt: new Date(), updatedAt: new Date() }
        );

        await queryInterface.bulkInsert('CommunityMembers', memberships);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('CommunityMembers', null, {});
        await queryInterface.bulkDelete('Communities', null, {});
    },
};
