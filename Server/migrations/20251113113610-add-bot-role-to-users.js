'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if enum type exists first
        const [results] = await queryInterface.sequelize.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role'
            ) AS exists;
        `);

        if (results[0].exists) {
            // Add 'bot' to the role enum if it doesn't exist
            await queryInterface.sequelize.query(`
                DO $$ BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_enum 
                        WHERE enumlabel = 'bot' 
                        AND enumtypid = (
                            SELECT oid FROM pg_type WHERE typname = 'enum_Users_role'
                        )
                    ) THEN
                        ALTER TYPE "enum_Users_role" ADD VALUE 'bot';
                    END IF;
                END $$;
            `);
        }
    },

    async down(queryInterface, Sequelize) {
        // Cannot remove enum values in PostgreSQL
        // This is a limitation of PostgreSQL
    },
};
