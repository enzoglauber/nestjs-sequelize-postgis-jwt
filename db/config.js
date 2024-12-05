// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv')
dotenv.config()
// export default process.env.NODE_ENV === 'production' ? prod : dev

const config = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
  dialectOptions: {
    ssl: false
  }
}

module.exports = config
