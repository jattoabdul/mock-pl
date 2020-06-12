import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'regenerator-runtime/runtime.js'

import { isString, isObject } from './validator'

import config from './../config'
import User from './../model/user.model'

/**
 * Request and Response Handlers.
 */
/**
 * @desc This is a logger method
 * @function log
 * @param {*} data error data
 * @param {*} logType could be info, debug, success, table
 */
export const log = (data, logType = 'info') => {
  if (logType === 'error') {
    console.error(data)
  } else if (logType === 'info') {
    console.info(data)
  } else {
    console.log(data)
  }
}

/**
 * @desc Handles our Application Server Response Messages
 * @param {*} res response object from server
 * @param {Number} status
 * @returns {*} server response
 */
export const handleServerResponse = (res, data, status = 200) => {
  if (isString(data)) {
    return res.status(status).json({ message: data })
  } else if (isObject(data)) {
    const { success, payload, meta } = data
    return res.status(status).json({
      success,
      meta,
      payload
    })
  } else {
    return res.status(status).send(data)
  }
}

/**
 * @desc Sends our Application Server Response Messages
 * @param {*} req request object
 * @param {*} res response object
 * @returns {*} server response
 */
export const sendResponse = (req, res) => {
  const payload = req.payload

  return handleServerResponse(res, {
    success: true,
    payload
  })
}

/**
 * @desc Handles our Application Server Error Messages
 * @param {*} response response object from server
 * @param {*} error error message
 * @returns {*} error response
 */
export const handleServerError = (response, msg, status = 500) => {
  return response.status(status || 500).send({
    success: false,
    message: msg
  })
}

/**
 * App Wide Helpers.
 */

/**
 * @function generateRandomChars
 * @param {Number} len string length
 * @returns {String} random string (mix of chars and nums selected at random)
 */
export const generateRandomChars = (len = 6) => {
  return Math.random().toString(36).substring(2, 2 + len)
}

/**
 * @function generateRandomNo
 * @param {Number} min mininum number
 * @param {Number} max maximum number
 * @returns {Number} random number betweem min and max value
 */
export const generateRandomNo = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * @function generateId
 * @returns {*} random ID (built with time and date and random char generator)
 */
export const generateId = () => {
  const now = new Date()
  return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${generateRandomChars().toUpperCase()}`
}

/**
 * @function setPagination
 * @param {object} req client request object
 * @param {object} res server response (won't be touched)
 * @param {Function} next onto the next middleware!
 * @returns {Function} next onto the next middleware!
 * @description Pagination Middleware for Get Routes
 */
export const setPagination = (req, res, next) => {
  const { perPage: defaultPerPage } = config.paginationConfigs

  let { page, perPage } = req.query
  page = parseInt(page)
  perPage = parseInt(perPage)

  const paginationData = {
    currentPage: page || 1,
    perPage: perPage || defaultPerPage,
    paginationQueryOptions: {
      sort: { _id: -1 },
      skip: perPage * ((page || 1) - 1),
      limit: perPage || defaultPerPage
    }
  }
  // TODO: Remove logs
  console.log(JSON.stringify({ paginationData, page, pageTrue: Boolean(page) }, null, 2))

  req.paginationData = paginationData

  return next()
}

/**
 * @desc Generate Page meta object
 * @function pageMeta
 * @param {Number} count total number of rows
 * @param {Number} perPage
 * @param {Number} page
 * @returns {Object} Pagination Meta Data
 */
export const pageMeta = (count, perPage, page = 1) => {
  const totalPages = Math.ceil(count / perPage)
  const nextPage = (page + 1) <= totalPages ? (page + 1) : null
  const prevPage = page > 1 ? (page - 1) : null

  return {
    totalRows: count,
    totalPages,
    currentPage: page,
    nextPage,
    prevPage
  }
}

/**
 * @desc Capitalize a word
 * @function capitalize
 * @param {String} word word to be capitalized
 * @returns {String} Capitalized Version of inputted string
 */
export const capitalize = word => {
  if (!word) return ''
  if (typeof word === 'string' || word instanceof String) {
    return word.split(' ').map(w => w ? `${w.slice(0, 1).toUpperCase()}${w.slice(1).toLowerCase()}` : '').join(' ')
  } else {
    return ''
  }
}

/**
 * @desc get date object for a day based on it's index i.e tue = 2
 * @function getXday
 * @param day {number} day index (defaults to 0 => Sun)
 * @return {Date} date object for sun or specified day
 */
export const getXday = (day = 0) => {
  const now = new Date()

  return new Date(now.setDate(now.getDate() - now.getDay() + day))
}

/**
 * @desc get First day of the month
 * @function getFirstDayOfTheMonth
 * @return {Date} date object for first day in the current month
 */
export const getFirstDayOfTheMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Auth Helpers.
 */

/**
 * @function hashPassword
 * @param {string} password password to be hashed
 * @description hashes a password with bcrypt
 * @returns {string} password hash
 */
export const hashPassword = password => {
  const saltRounds = config.saltRounds
  const hash = bcrypt.hashSync(password, parseInt(saltRounds, 10))

  return hash
}

/**
 * @function checkPassword
 * @param {string} password in ordinary form
 * @param {string} hash password hash form
 * @description checks if a password corresponds with saved hash in db
 * @returns {boolean} true if correct of false if incorrect
 */
export const checkPassword = (password, hash) => bcrypt.compareSync(password, hash)

/**
 * @function createToken
 * @param {Number} id user id gotten from database
 * @param {Boolean} isAdmin boolean value to check for admin user
 * @description creates new jwt token for authentication
 * @returns {String} newly created jwt
 */
export const createToken = (data, tokenType = 'loginSignup') => {
  data.created = Date.now()
  data.expiresBy = Date.now() + (config.tokenLifespan)

  data.issuedEnv = config.environment

  const token = jwt.sign({ ...data }, config.tokenSecret)
  return token
}

/**
 * @function validateSession
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object | RequestHandler} response object
 * @description check if session is active
 */
export const validateSession = async (req, res, next) => {
  if (req.session.accessToken) {
    return next()
  }
  return handleServerError(res, 'Your Session has expired, Please Relogin', 401)
}

/**
 * @function validateToken
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object | RequestHandler} response object
 * @description check if jwt token is appended in header
 */
export const validateToken = async (req, res, next) => {
  let token = req.headers.authorization || req.headers['x-access-token']

  if (token) {
    if (req.headers.authorization) {
      if (token.includes('Bearer ')) {
        token = token.replace('Bearer ', '')
      }
    }
    try {
      const decoded = jwt.verify(token, config.tokenSecret)

      if (!decoded._id) return handleServerError(res, 'token has no id!', 403)

      const user = await User.findById(decoded._id).select('accessToken')

      if (!user) return handleServerError(res, 'User not found or has been removed', 401)

      if (!user.accessToken || req.session.accessToken !== decoded.authKey || user.accessToken !== decoded.authKey) {
        return handleServerError(res, 'invalid/expired session and token', 401)
      }

      req.user = decoded

      return next()
    } catch (err) {
      return handleServerError(res, 'Invalid auth token', 401)
    }
  }
  return handleServerError(res, 'You have to be loggedin first', 401)
}

/**
 * @function decodeToken
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object | RequestHandler} response object
 * @description decodes Token if jwt token is appended in header
 */
export const decodeToken = async token => {
  if (!token) return {}
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

/**
 * @desc ensure request is made by an admin
 * @function isAdmin
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next Next middleware callback
 * @returns {*} next middleware or error response
 */
export const isAdmin = async (req, res, next) => {
  const {
    role
  } = req.user

  if (role && role.toLowerCase().includes('admin')) {
    return next()
  } else {
    return handleServerError(res, 'Only an admin can perform this operation', 401)
  }
}

/**
 @desc ensure request is made by a super admin
 * @function isSuperAdmin
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next Next middleware callback
 * @returns {*} next middleware or error response
 */
export const isSuperAdmin = async (req, res, next) => {
  const {
    role
  } = req.user

  if (role && role.toLowerCase() === 'super_admin') {
    return next()
  } else {
    return handleServerError(res, 'Only special admins can perform this operation', 401)
  }
}
