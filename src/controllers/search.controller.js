// import mongoose from 'mongoose'
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

    // TODO: use $regex matchers
    const teams = await TeamModel.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ['$name', term] },
              { $eq: ['$acronym', term] }
            ]
          }
        }
      }
    ])

    const fixtures = await FixtureModel.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ['$status', term] },
              { $eq: ['$key', term] }
            ]
          }
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
