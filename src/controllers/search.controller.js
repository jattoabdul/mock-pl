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
      // {
      //   $lookup: {
      //     from: 'fixtures',
      //     let: { team_id: '$_id' },
      //     as: 'fixtures',
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $or: [
      //               { $eq: ['$homeTeam', '$$team_id'] },
      //               { $eq: ['$awayTeam', '$$team_id'] }
      //             ]
      //           }
      //         }
      //       }
      //     ]
      //   }
      // }
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
      // {
      //   $lookup: {
      //     from: 'fixtures',
      //     let: { team_id: '$_id' },
      //     as: 'fixtures',
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $or: [
      //               { $eq: ['$homeTeam', '$$team_id'] },
      //               { $eq: ['$awayTeam', '$$team_id'] }
      //             ]
      //           }
      //         }
      //       }
      //     ]
      //   }
      // }
    ])

    const result = [...teams, ...fixtures]
    console.log(result, 'res')
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
