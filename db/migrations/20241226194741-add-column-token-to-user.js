'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'refreshToken', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user', 'refreshToken')
  }
}
