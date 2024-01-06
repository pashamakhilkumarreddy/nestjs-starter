'use strict';

const users = [
  {
    title: 'Software Engineer',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    countryCode: '1',
    phone: '1112223333',
    roles: [
      {
        name: 'developer'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Marketing Manager',
    firstName: 'Sarah',
    lastName: 'Taylor',
    email: 'sarah.taylor@example.com',
    countryCode: '44',
    phone: '2223334444',
    roles: [
      {
        name: 'marketing_lead'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Financial Analyst',
    firstName: 'Kevin',
    lastName: 'White',
    email: 'kevin.white@example.com',
    countryCode: '33',
    phone: '3334445555',
    roles: [
      {
        name: 'finance_analyst'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  }
};
