import Joi from '@hapi/joi'
import { handleServerError } from '../utils/helpers'

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for createTeam/updateTeam input
 * @returns {Response | RequestHandler} error or request handler
 */
export const addOrEditTeamPolicy = (req, res, next) => {
  const { name, acronym } = req.body

  const schema = Joi.object({
    name: Joi.string().required(),
    acronym: Joi.string().min(3).max(3).required()
  })

  const { error } = schema.validate({ name, acronym })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}
