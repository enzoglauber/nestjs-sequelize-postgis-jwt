'use strict'

const baseLatitude = -23.5356837
const baseLongitude = -46.5244254

// Helper para calcular coordenadas
const generateCoordinates = (lat, lon, distanceKm) => {
  const earthRadiusKm = 6371 // Raio da Terra em km
  const deltaLat = (distanceKm / earthRadiusKm) * (180 / Math.PI) // Deslocamento em latitude
  const deltaLon = (distanceKm / (earthRadiusKm * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI) // Deslocamento em longitude
  return `POINT(${lon + deltaLon} ${lat + deltaLat})`
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar usuários
    const users = await queryInterface.bulkInsert(
      'Users', // Nome da tabela no banco de dados
      [
        {
          email: 'user1@example.com',
          name: 'User One',
          password: 'password1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          name: 'User Two',
          password: 'password2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true } // Retorna os registros inseridos
    )

    // Pega os IDs gerados automaticamente
    const user1Id = users[0].id
    const user2Id = users[1].id

    // Endereços
    const addresses = [
      {
        name: 'Address 1 (Less than 1 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 0.8)}', 4326)`),
        userId: user1Id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Address 2 (Less than 1 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 0.5)}', 4326)`),
        userId: user1Id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Address 3 (3-5 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 3.2)}', 4326)`),
        userId: user2Id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Address 4 (3-5 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 4.7)}', 4326)`),
        userId: user2Id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Address 5 (3-5 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 3.5)}', 4326)`),
        userId: user2Id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Address 6 (More than 5 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 6.1)}', 4326)`),
        userId: user1Id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Inserir os endereços
    await queryInterface.bulkInsert('Addresses', addresses, {})
  },

  async down(queryInterface) {
    // Remover os endereços e usuários
    await queryInterface.bulkDelete('Addresses', null, {})
    await queryInterface.bulkDelete('Users', null, {})
  }
}
