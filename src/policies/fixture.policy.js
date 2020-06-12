import { handleServerError } from '../utils/helpers'

const Joi = require('@hapi/joi')
  .extend(require('@hapi/joi-date'))

/**
 * @function addFixturePolicy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for createTeam/updateTeam input
 * @returns {Response | RequestHandler} error or request handler
 */
export const addFixturePolicy = (req, res, next) => {
  const {
    homeTeam,
    awayTeam,
    gameWeek,
    matchDay
  } = req.body

  const schema = Joi.object({
    homeTeam: Joi.string().required(),
    awayTeam: Joi.string().required(),
    gameWeek: Joi.number().min(1).required(),
    matchDay: Joi.date().format('YYYY-MM-DD').utc().required()
  })

  const { error } = schema.validate({
    homeTeam,
    awayTeam,
    gameWeek,
    matchDay
  })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}

/**
 * @function editFixturePolicy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for createTeam/updateTeam input
 * @returns {Response | RequestHandler} error or request handler
 */
export const editFixturePolicy = (req, res, next) => {
  const {
    gameWeek,
    matchDay
  } = req.body

  const schema = Joi.object({
    gameWeek: Joi.number().min(1),
    matchDay: Joi.date().format('YYYY-MM-DD').utc()
  })

  const { error } = schema.validate({
    gameWeek,
    matchDay
  })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}
