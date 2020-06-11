import express from 'express'
import { handleServerResponse } from '../utils/helpers'

/**
 * Import Routes
 */
import authRoutes from './auth.routes'

const router = express.Router()

/**
 * Route Blueprint Definitions
 *
 * Use API Routes
 */
router.use('/auth', authRoutes)

/* GET api home route. */
router.get('/', (req, res) => {
  return handleServerResponse(res, 'Welcome to the beginning of Nothingness 🚀')
})

export default router
