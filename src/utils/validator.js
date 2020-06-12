/**
 * Data Type Validators.
 */
export const isString = value => typeof value === 'string' || value instanceof String

export const isNumber = value => typeof value === 'number' && isFinite(value)

export const isArray = value => Array.isArray(value)

export const isFunction = value => typeof value === 'function'

export const isObject = value => value && typeof value === 'object' && value.constructor === Object

export const isNull = value => value === null

export const isUndefined = value => typeof value === 'undefined'

export const isBoolean = value => typeof value === 'boolean'

export const isRegex = value => value && typeof value === 'object' && value.constructor === RegExp

export const isError = value => value instanceof Error && typeof value.message !== 'undefined'

export const isDate = value => value instanceof Date

export const isSymbol = value => typeof value === 'symbol'

/**
 * Validates email
 * @param {string} email
 * @return {Boolean} true or false
 */
export const validateEmail = email => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

/**
 * Validates DB Record
 * @param {ID} id
 * @return {Boolean} true or false
 */
export const isValidId = id => {
  return require('mongoose').Types.ObjectId.isValid(id) && /^[a-fA-F0-9]{24}$/.test(id)
}
