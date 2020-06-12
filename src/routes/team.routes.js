import express from 'express'

/**
 * Import Policies.
 */
import { addOrEditTeamPolicy } from '../policies/team.policy'

/**
 * Import Controllers.
 */
import { createTeam, getTeams, updateTeam, removeTeam } from '../controllers/team.controller'

/**
 * Import Middlewares.
 */
import { validateToken, validateSession, isAdmin } from '../utils/helpers'

const router = express.Router()

/**
 * Route Blueprint.
 */
// Aunthenticated Routes
router.get('/', validateSession, validateToken, getTeams)
router.get('/all', validateSession, validateToken, getTeams)

// Admin Routes
router.post('/', addOrEditTeamPolicy, validateSession, validateToken, isAdmin, createTeam)
router.put('/:id', addOrEditTeamPolicy, validateSession, validateToken, isAdmin, updateTeam)
router.delete('/:id', validateSession, validateToken, isAdmin, removeTeam)

export default router
