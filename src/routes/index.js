import express from 'express'
import { handleServerResponse } from '../utils/helpers'

/**
 * Import Routes
 */
import authRoutes from './auth.routes'
import teamRoutes from './team.routes'
import fixtureRoutes from './fixture.routes'
import { search } from '../controllers/search.controller'

const router = express.Router()

/**
 * Route Blueprint Definitions
 *
 * Use API Routes
 */
router.use('/auth', authRoutes)
router.use('/fixtures', fixtureRoutes)
router.use('/teams', teamRoutes)

/* GET api search route. */
router.get('/search', search)

/* GET api home route. */
router.get('/', (req, res) => {
  return handleServerResponse(res, 'Welcome to the beginning of Nothingness 🚀')
})

export default router
