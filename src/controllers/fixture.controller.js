import {
  generateId,
  handleServerError,
  handleServerResponse
} from '../utils/helpers'


import FixtureModel from '../model/fixture.model'
import { v1 as uuid } from 'uuid'

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
    })
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
      gameWeek,
      matchDay
    } = req.body

    // check if fixture exists
    let fixtureExist = await FixtureModel.findById(id)
    console.log(fixtureExist, 'findOne fixture')

    if (!fixtureExist) return handleServerError(res, 'Fixture does not exist', 404)

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
    // .populate('fixtures')

    if (!fixture) return handleServerError(res, 'Fixture not found or has been deleted', 403)

    // if (fixture.fixtures.length) return handleServerError(res, 'Fixture has fixtures, can\'t delete', 403)

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
    const fixtures = await FixtureModel.find()
      .select('-__v')
      .populate('homeTeam', 'name acronym')
      // .populate('homeTeam', '-_id -__v -fixtures -createdAt -updatedAt')
      .populate('awayTeam', 'name acronym')
      // .populate('awayTeam', '-_id -__v -fixtures -createdAt -updatedAt')

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
export const generateFixtureLink = async(req, res) => {
  await true
}
