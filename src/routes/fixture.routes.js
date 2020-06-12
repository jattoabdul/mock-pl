import express from 'express'

/**
 * Import Policies.
 */
import { addOrEditFixturePolicy } from '../policies/fixture.policy'

/**
 * Import Controllers.
 */
import {
  createFixture,
  getFixtures,
  updateFixture,
  removeFixture,
  generateFixtureLink
} from '../controllers/fixture.controller'

/**
 * Import Middlewares.
 */
import { validateToken, validateSession, isAdmin } from '../utils/helpers'

const router = express.Router()

/**
 * Route Blueprint.
 */
// Aunthenticated Routes
router.get('/', validateSession, validateToken, getFixtures)
router.get('/all', validateSession, validateToken, getFixtures)

// Admin Routes
router.post('/', addOrEditFixturePolicy, validateSession, validateToken, isAdmin, createFixture)
router.post('/:id/link/generate', addOrEditFixturePolicy, validateSession, validateToken, isAdmin, generateFixtureLink)
router.put('/:id', addOrEditFixturePolicy, validateSession, validateToken, isAdmin, updateFixture)
router.delete('/:id', validateSession, validateToken, isAdmin, removeFixture)

export default router
