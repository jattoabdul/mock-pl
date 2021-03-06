/**
 * Module dependencies.
 */
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import 'regenerator-runtime/runtime.js'
import { json, urlencoded } from 'body-parser'
import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'
import { handleServerResponse } from './utils/helpers'

import config from './config'

/**
 * Import API Routes.
 */
import api from './routes/index'

const redisURL = config.redisURL
const RedisStore = connectRedis(session)
const redisClient = redis.createClient(redisURL)

const app = express()

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection
  .on('open', () => {
    if (config.environment !== 'test') {
      console.log('Mongoose DB connection open')
    }
  })
  .on('error', (err) => {
    console.log(`Connection to DB error: ${err.message}`)
  })

/**
 * Helpers
 */

/**
 * Use App Middlewares
 */
app.use(helmet())
  .disable('x-poweredBy')
  .use(cors())
  .use(json({
    limit: '1mb'
  }))
  .use(urlencoded({
    extended: false
  }))

if (config.environment !== 'production') {
  app.use(logger('dev'))
}

const sessionTimeout = 3600000
const sess = {
  name: 'user_sid',
  secret: config.sessionSecret,
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    expires: new Date(Date.now() + sessionTimeout),
    maxAge: sessionTimeout
  }
}
redisClient.on('error', () => console.error('oh no'))

if (config.environment === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

// Handle Session Exceptions
app.use(function (req, res, next) {
  if (!req.session.accessToken) {
    res.clearCookie('user_sid')
  }
  next()
})

/**
 * Use API Routes
 */
app.use('/v1', api)
app.use('/api/v1', api)

/* GET * all unmatched routes. */
app.all('*', (req, res) => {
  handleServerResponse(res, "Invalid route! try '/'", 404)
})

module.exports = { redisClient, app }
