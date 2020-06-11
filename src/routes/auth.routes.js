import express from 'express'

/**
 * Import Policies.
 */
import { loginPolicy, signupPolicy, toggleRolePolicy } from '../policies/auth.policy'

/**
 * Import Controllers.
 */
import { createUser, loginUser, signout, toggleUserRole } from '../controllers/user.controller'

/**
 * Import Middlewares.
 */
import { validateToken, validateSession, isAdmin } from '../utils/helpers'

const router = express.Router()

/**
 * Route Blueprint.
 */
router.post('/signup', signupPolicy, createUser)
router.post('/login', loginPolicy, loginUser)
router.put('/logout', signout)
router.put('/toggle/role', toggleRolePolicy, validateSession, validateToken, isAdmin, toggleUserRole)

export default router
