import express from 'express'

/**
 * Import Policies.
 */
import { addFixturePolicy, editFixturePolicy } from '../policies/fixture.policy'

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
router.post('/', addFixturePolicy, validateSession, validateToken, isAdmin, createFixture)
router.post('/:id/link/generate', validateSession, validateToken, isAdmin, generateFixtureLink)
router.put('/:id', editFixturePolicy, validateSession, validateToken, isAdmin, updateFixture)
router.delete('/:id', validateSession, validateToken, isAdmin, removeFixture)

export default router
