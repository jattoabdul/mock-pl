import { Schema, model } from 'mongoose'

import { validateEmail } from '../utils/validator'
import { hashPassword } from '../utils/helpers'

/**
 * User MOdel Schema.
 */
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'super_admin'],
    default: 'customer'
  },
  password: String,
  accessToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

/**
 * Encrypt Password Before Save Filter.
 */
userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) { // don't rehash if no password change
    next()
  }
  user.password = hashPassword(user.password)

  return next()
})

/**
 * User Model Table.
 */
const UserModel = model('User', userSchema)

export default UserModel
