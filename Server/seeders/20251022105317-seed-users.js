'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@mail.com',
        password: await bcrypt.hash('admin123', salt),
        username: 'admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user1@mail.com',
        password: await bcrypt.hash('user123', salt),
        username: 'user1',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user2@mail.com',
        password: await bcrypt.hash('user123', salt),
        username: 'user2',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
