/**
 * Module dependencies.
 */
import dotenv from 'dotenv'

dotenv.config()

/**
 * App Wide Environment Variables.
 */
export default {
  dbUrl: process.env.DB_URL,
  port: process.env.APP_PORT
}
