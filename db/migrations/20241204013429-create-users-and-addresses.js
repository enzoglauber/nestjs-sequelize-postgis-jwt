'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    })

    await queryInterface.createTable('address', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      location: { type: Sequelize.GEOMETRY('POINT', 4326), allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    })

    await queryInterface.addConstraint('address', {
      fields: ['userId'],
      type: 'foreign key',
      references: { table: 'user', field: 'id' },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('address')
    await queryInterface.dropTable('user')
  }
}
