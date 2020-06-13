/**
 * Module dependencies.
 */
import dotenv from 'dotenv'

dotenv.config()

/**
 * Authorization Roles.
 */
const Roles = ['customer', 'admin', 'super_admin']
const FixtureStatus = ['pending', 'started', 'completed']

/**
 * App Wide Environment Variables.
 */
export default {
  environment: process.env.NODE_ENV || 'dev',
  dbUrl: process.env.DB_URL,
  appURL: process.env.APP_URL,
  redisURL: process.env.REDIS_URL,
  port: process.env.PORT,
  saltingRounds: process.env.SALT_ROUND,
  tokenSecret: process.env.TOKEN_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  tokenLifespan: process.env.TOKEN_LIFESPAN || (1000 * 3600 * 24 * 3),
  Roles,
  FixtureStatus,
  paginationConfigs: {
    perPage: 50
  }
}
