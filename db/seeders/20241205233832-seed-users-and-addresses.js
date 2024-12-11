'use strict'

const baseLatitude = -23.5356837
const baseLongitude = -46.5244254

const generateCoordinates = (lat, lon, distanceKm) => {
  const earthRadiusKm = 6371
  const deltaLat = (distanceKm / earthRadiusKm) * (180 / Math.PI)
  const deltaLon = (distanceKm / (earthRadiusKm * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI)
  return `POINT(${lon + deltaLon} ${lat + deltaLat})`
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.bulkInsert(
      'Users',
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
      { returning: true }
    )

    const user1Id = users[0].id
    const user2Id = users[1].id

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
        name: 'Address 2 (2-3 km)',
        location: Sequelize.literal(`ST_GeomFromText('${generateCoordinates(baseLatitude, baseLongitude, 2.2)}', 4326)`),
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

    await queryInterface.bulkInsert('Addresses', addresses, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Addresses', null, {})
    await queryInterface.bulkDelete('Users', null, {})
  }
}

// {
//   "name": "Vila Matilde",
//   "location": [
//     -23.535060, -46.525199
//   ]
// }
// {
//   "name": "Amador Bueno",
//   "location": [
//     -23.523108064217393, -46.52124855850327
//   ]
// }
// {
//   "name": "Guilhermina",
//   "location": [
//     -23.52925620874843, -46.51646349687827
//   ]
// }
// {
//   "name": "Patriarca",
//   "location": [
//     -23.531184207667177, -46.501443127308214
//   ]
// }
// {
//   "name": "Alvim",
//   "location": [
//     -23.54054837204759, -46.484341362355245
//   ]
// }
// {
//   "name": "Penha",
//   "location": [
//     -23.533499911088622, -46.54257644315508
//   ]
// }
// {
//   "name": "Carrão",
//   "location": [
//     -23.5377890091518, -46.564103871778904
//   ]
// }
// {
//   "name": "Tatuapé",
//   "location": [
//     -23.54030704283924, -46.57618454079719
//   ]
// }
