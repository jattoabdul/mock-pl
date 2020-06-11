import Joi from '@hapi/joi'
import { handleServerError } from '../utils/helpers'

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for signup input
 * @returns {Response | RequestHandler} error or request handler
 */
export const signupPolicy = (req, res, next) => {
  const { name, email, password } = req.body

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  const { error } = schema.validate({ name, email, password })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for login inputs
 * @returns {Response | RequestHandler} error or request handler
 */
export const loginPolicy = (req, res, next) => {
  const { email, password } = req.body

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const { error } = schema.validate({ email, password })

  if (error) {
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for toggling user role inputs
 * @returns {Response | RequestHandler} error or request handler
 */
export const toggleRolePolicy = (req, res, next) => {
  const { email, role } = req.body

  const schema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().required()
  })

  const { error } = schema.validate({ email, role })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}
