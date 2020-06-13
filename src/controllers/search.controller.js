import {
  handleServerError,
  handleServerResponse
} from '../utils/helpers'

import TeamModel from '../model/team.model'
import FixtureModel from '../model/fixture.model'

/**
 * @method search
 * @desc fetch all teams
 * @param {object} req request from client
 * @param {object} res response from server
 */
export const search = async (req, res) => {
  try {
    const {
      term
    } = req.query

    const teams = await TeamModel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: new RegExp(term, 'i') } },
            { acronym: { $regex: new RegExp(term, 'i') } }
          ]
        }
      }
    ])

    const fixtures = await FixtureModel.aggregate([
      {
        $match: {
          $or: [
            { status: { $regex: new RegExp(term, 'i') } },
            { key: { $regex: new RegExp(term, 'i') } }
          ]
        }
      }
    ])

    const result = [...teams, ...fixtures]
    if (!result.length) {
      return handleServerError(res, 'No record found', 403)
    }

    // merge teams and fixtures results
    return handleServerResponse(res, {
      success: true,
      payload: {
        result: result
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
