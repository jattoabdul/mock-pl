import {
  checkPassword,
  handleServerError,
  handleServerResponse,
  createToken
} from '../utils/helpers'
import { v1 as uuid } from 'uuid'

import UserModel from '../model/user.model'

import config from '../config'

/**
 * @method createUser
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description receives user details via parsed body and create an instance of the User Model in the database
 */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body

    // check if email exist
    const emailExist = await UserModel.findOne({
      email
    })

    if (emailExist) return handleServerError(res, 'User already exist', 409)

    const user = new UserModel({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    })
    // Generate Access Key To Verify Token
    user.accessToken = uuid()

    const userData = await user.save()
    // TODO: send welcome email

    const userInfo = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    }

    // Create token from user info
    const token = createToken({
      ...userInfo,
      authKey: userData.accessToken
    })

    // Create Session with role and accessToken params
    req.session.accessToken = userData.accessToken
    req.session.role = userData.role

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Signup Successful! Welcome on board 🤗',
        user: userInfo,
        token
      }
    }, 201)
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method loginUser
 * @param { object } req
 * @param { object } res
 * @returns { object } returns the object containing response and jwt token
 * @description receives user details and checks if it exists in the database and returns a token
 */
export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase()
    })

    // if user is not found
    if (!user) {
      return handleServerError(res, 'Email or password incorrect', 401)
    }

    if (!checkPassword(password, user.password)) {
      return handleServerError(res, 'Email or password incorrect', 401)
    }

    // set accessToken if it doesn't exist
    if (!user.accessToken) {
      user.accessToken = uuid()
      await user.save()
    }

    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    // create token from user info
    const token = createToken({
      ...userInfo,
      authKey: user.accessToken
    })

    // Create Session with role and accessToken params
    req.session.accessToken = user.accessToken
    req.session.role = userInfo.role

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Login Successful! Welcome back 🤗',
        user: userInfo,
        token
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method toggleUserRole
 * @param { object } req
 * @param { object } res
 * @returns { object } returns the object containing response and jwt token
 * @description receives user email and new role and update user with email to new role
 */
export const toggleUserRole = async (req, res) => {
  try {
    const {
      email,
      role
    } = req.body

    const update = {}

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase()
    })

    // if user is not found
    if (!user) {
      return handleServerError(res, 'User not found', 404)
    }

    if (!config.Roles.includes(role.toLowerCase())) {
      return handleServerError(res, 'Role is not permitted', 403)
    }

    // a super admin account role cannot be toggled
    if (user.role.toLowerCase().includes('super')) {
      return handleServerError(res, 'You cannot toggle this account role', 403)
    }

    // only super admins can toggle another admin account
    if (user.role.toLowerCase().includes('admin') && req.user.role.toLowerCase() !== 'super_admin') {
      return handleServerError(res, 'You cannot update admin account role', 403)
    }

    // only super admins can toggle another account to super
    if (role.toLowerCase().includes('super') && req.user.role.toLowerCase() !== 'super_admin') {
      return handleServerError(res, 'You cannot upgrade account to super user role', 403)
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      update.role = role
    }

    if (!Object.keys(update).length) {
      return handleServerResponse(res, {
        success: true,
        payload: {
          message: 'No changes made to user role'
        }
      })
    }

    // set new accessToken
    update.accessToken = uuid()
    Object.keys(update).forEach(field => {
      user[field] = update[field]
    })
    await user.save()

    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'User Role Updated Successfully 🤗',
        user: userInfo
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method signout
 * @param { object } req
 * @param { object } res
 * @returns { object } returns the object containing response and jwt token
 * @description invalidates user session and cookies
 */
export const signout = async (req, res) => {
  try {
    // get current session
    req.session.destroy((err) => {
      if (err) return handleServerError(res, err)
      res.clearCookie('user_sid')
      return handleServerResponse(res, {
        success: true,
        payload: { message: 'User Logged Out. Bye! 👋🏽' }
      })
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
