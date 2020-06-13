import {
  firstDateIsPastDayComparedToSecondDate,
  handleServerError,
  handleServerResponse
} from '../utils/helpers'

import FixtureModel from '../model/fixture.model'
import { v1 as uuid } from 'uuid'
import UserModel from '../model/user.model'
import config from '../config'

/**
 * @method createFixture
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description receives Fixture details via parsed body and create an instance of the Fixture Model in the database
 */
export const createFixture = async (req, res) => {
  try {
    const {
      homeTeam,
      awayTeam,
      gameWeek,
      matchDay
    } = req.body

    // check if fixture exists
    const fixtureExist = await FixtureModel.findOne({
      homeTeam, awayTeam
    })

    if (fixtureExist) return handleServerError(res, 'fixture for this teams already exist', 400)

    const newFixture = await new FixtureModel({
      key: uuid(),
      homeTeam,
      awayTeam
    })
    newFixture.schedule = {
      matchDay: Date.parse(matchDay),
      gameWeek: Number(gameWeek)
    }

    newFixture.save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Fixture created successfully 😊',
        fixture: newFixture
      }
    }, 201)
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method updateFixture
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description updates fixture details with parsed body for id in query param
 */
export const updateFixture = async (req, res) => {
  try {
    const {
      id
    } = req.params
    const {
      status,
      gameWeek,
      matchDay
    } = req.body

    // check if fixture exists
    let fixtureExist = await FixtureModel.findById(id)

    if (!fixtureExist) return handleServerError(res, 'Fixture does not exist', 404)

    if (!config.FixtureStatus.includes(status.toLowerCase())) {
      return handleServerError(res, 'Status is not permitted', 403)
    }

    if (status) fixtureExist.status = status.toLowerCase()
    if (gameWeek) fixtureExist.schedule.gameWeek = gameWeek
    if (matchDay) fixtureExist.schedule.matchDay = matchDay

    fixtureExist = await fixtureExist.save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Update successful',
        fixture: fixtureExist
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method removeFixture
 * @desc removes fixture supplied by id from query params if it doesn't have fixtures
 * @param {object} req request from client from client
 * @param {object} res response from server containing deleted category as payload if successful
 */
export const removeFixture = async (req, res) => {
  try {
    const {
      id
    } = req.params
    const fixture = await FixtureModel.findById(id)

    if (!fixture) return handleServerError(res, 'Fixture not found or has been deleted', 403)

    if (fixture.schedule.matchDay && firstDateIsPastDayComparedToSecondDate(fixture.schedule.matchDay, new Date())) {
      return handleServerError(res, 'Fixture has passed, can\'t be deleted', 403)
    }

    await fixture.remove()

    return handleServerResponse(res, {
      success: true,
      payload: {
        deleted: fixture
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method getFixtures
 * @desc fetch all fixtures
 * @param {object} req request from client
 * @param {object} res response from server
 */
export const getFixtures = async (req, res) => {
  try {
    const {
      status
    } = req.query

    console.log(status, 'status query')

    const queryParam = {}

    // if status and status exists in allowed status, add to queryParam.status
    if (status && config.FixtureStatus.includes(status.toLowerCase())) {
      queryParam.status = status.toLowerCase()
    }

    const fixtures = await FixtureModel.find(queryParam)
      .select('-__v')
      .populate('homeTeam', 'name acronym')
      .populate('awayTeam', 'name acronym')

    return handleServerResponse(res, {
      success: true,
      payload: {
        fixtures
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method generateFixtureLink
 * @desc generate unique link for a fixture
 * @param {object} req request from client
 * @param {object} res response from server
 */
export const generateFixtureLink = async (req, res) => {
  try {
    const {
      id
    } = req.params
    let fixture = await FixtureModel.findById(id)

    if (!fixture) return handleServerError(res, 'Fixture not found', 403)

    fixture.key = fixture.generateNewKey()
    await fixture.save()

    fixture = await FixtureModel.findById(id)
      .select('-__v')
      .populate('homeTeam', 'name acronym')
      .populate('awayTeam', 'name acronym')

    fixture = fixture.toJSON()

    return handleServerResponse(res, {
      success: true,
      payload: {
        fixture: {
          ...fixture,
          link: `http://host.com/api/v1/fixtures?key=${fixture.key}`
        }
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
