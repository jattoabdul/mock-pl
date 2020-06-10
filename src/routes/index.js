import express from 'express'
import { serverResponse } from '../utils/helpers'

/**
 * Import Routes
 */
import userRoutes from './user.routes'

const router = express.Router()

/**
 * Use API Routes
 */
router.use('/users', userRoutes)

/**
 * Route Blueprint Definitions
 */
/* GET api home route. */
router.get('/', (req, res) => {
  serverResponse(res, 'Welcome to the beginning of nothingness')
})

export default router
