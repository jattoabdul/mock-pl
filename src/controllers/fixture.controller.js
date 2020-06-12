import {
  handleServerError,
  handleServerResponse
} from '../utils/helpers'

import FixtureModel from '../model/fixture.model'

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
      name,
      acronym
    } = req.body

    // check if category exists
    const fixtureExist = await FixtureModel.findOne({
      acronym
    })

    if (fixtureExist) return handleServerError(res, 'fixture with this acronym already exist', 400)

    const newFixture = await new FixtureModel({
      name,
      acronym
    }).save()

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
      name,
      acronym
    } = req.body

    // check if category exists
    console.log(id, 'findOne id')
    let fixtureExist = await FixtureModel.findById(id)
    console.log(fixtureExist, 'findOne fixture')

    if (!fixtureExist) return handleServerError(res, 'Fixture does not exist', 404)

    if (name) fixtureExist.name = name
    if (acronym) fixtureExist.acronym = acronym

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
    // .populate('fixtures')

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
