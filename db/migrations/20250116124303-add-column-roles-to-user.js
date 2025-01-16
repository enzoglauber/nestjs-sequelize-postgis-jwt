'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'roles', {
      type: Sequelize.ARRAY(Sequelize.ENUM('ADMIN', 'USER', 'MANAGER')),
      allowNull: false,
      defaultValue: Sequelize.literal("ARRAY['USER']::enum_user_roles[]")
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user', 'roles')
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_roles";')
  }
}
