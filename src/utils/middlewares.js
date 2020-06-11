
/**
 * @desc middleware function to check for logged-in users
 * @param {object} res response from server
 * @param {object} req request from server
 * @param {function} next callback
 */
export const authenticate = (req, res, next) => {
  // if (req.session.user && req.cookies.user_sid) {
  if (!req.session.user && !req.header.token) {
    // user session and token is not valid
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}

/**
 * @desc middleware function to authorize based on roles
 * @desc roles param can be a single role string (e.g. Role.User or 'User')
 * @desc or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
 * @param {object} res response from server
 * @param {object} req request from server
 * @param {function} next callback
 * @param {array|string} roles data values: admin or user
 */
export const authorize = (req, res, next, roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  if (roles.length && !roles.includes(req.session.user.role)) {
    // user's role is not authorized
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next()
}
