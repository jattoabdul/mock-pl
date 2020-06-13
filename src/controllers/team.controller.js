import mongoose from 'mongoose'
import {
  handleServerError,
  handleServerResponse
} from '../utils/helpers'

import TeamModel from '../model/team.model'

/**
 * @method createTeam
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description receives team details via parsed body and create an instance of the Team Model in the database
 */
export const createTeam = async (req, res) => {
  try {
    const {
      name,
      acronym
    } = req.body

    // check if team exists
    const teamExist = await TeamModel.findOne({
      acronym
    })

    if (teamExist) return handleServerError(res, 'Team with this acronym already exist', 400)

    const newTeam = await new TeamModel({
      name,
      acronym
    }).save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Team created successfully 😊',
        team: newTeam
      }
    }, 201)
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method updateTeam
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description updates team details with parsed body for id in query param
 */
export const updateTeam = async (req, res) => {
  try {
    const {
      id
    } = req.params
    const {
      name,
      acronym
    } = req.body

    // check if team exists
    let teamExist = await TeamModel.findById(id)

    if (!teamExist) return handleServerError(res, 'Team does not exist', 404)

    if (name) teamExist.name = name
    if (acronym) teamExist.acronym = acronym

    teamExist = await teamExist.save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Update successful',
        team: teamExist
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method removeTeam
 * @desc removes team supplied by id from query params if it doesn't have fixtures
 * @param {object} req request from client from client
 * @param {object} res response from server containing deleted category as payload if successful
 */
export const removeTeam = async (req, res) => {
  try {
    const {
      id
    } = req.params

    let team = await TeamModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'fixtures',
          let: { team_id: '$_id' },
          as: 'fixtures',
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$homeTeam', '$$team_id'] },
                    { $eq: ['$awayTeam', '$$team_id'] }
                  ]
                }
              }
            }
          ]
        }
      }
    ])

    if (!team.length) return handleServerError(res, 'Team not found or has been deleted', 403)

    if (team[0].fixtures.length) return handleServerError(res, 'Team has fixtures, can\'t be deleted', 403)

    team = await TeamModel.findById(id)
    await team.remove()

    return handleServerResponse(res, {
      success: true,
      payload: {
        deleted: team
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
/**
 * @method getTeams
 * @desc fetch all teams
 * @param {object} req request from client
 * @param {object} res response from server
 */
export const getTeams = async (req, res) => {
  try {
    const teams = await TeamModel.find()
      .select('-__v')
      .populate('fixtures', '-__v')

    return handleServerResponse(res, {
      success: true,
      payload: {
        teams
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
