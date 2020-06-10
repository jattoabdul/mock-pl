/**
 * Module dependencies.
 */
import express from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'

import config from './config'

/**
 * Import API Routes.
 */
import api from './routes/index'
import { serverResponse } from './utils/helpers'

const app = express()

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true
})
mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open')
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`)
  })

/**
 * Helpers
 */

/**
 * @desc Normalize a port into a number, string, or false.
 * @param {string} type response type: success or error
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

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
  .use(logger('dev'))
  .use(cookieParser())

/**
 * Use API Routes
 */
app.use('/v1', api)
app.use('/api/v1', api)

/**
 * Root Application Route Blueprint Definitions
 */
/* GET home route. */
app.get('/', (req, res) => {
  serverResponse(res, 'Welcome to the Workshop')
})
/* GET * all unmatched routes. */
app.all('*', (req, res) => {
  serverResponse(res, 'Invalid route', 404, 'error')
})

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(
  config.port || '3000')
app.set('port', port)

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
