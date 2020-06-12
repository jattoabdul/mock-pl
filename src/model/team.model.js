import { Schema, model } from 'mongoose'

const { ObjectId } = Schema.Types

/**
 * User Model Schema.
 */
const teamSchema = new Schema({
  name: {
    type: String,
    required: 'Team Name is Required'
  },
  acronym: {
    type: String,
    capitalize: true,
    unique: true,
    trim: true,
    required: 'Team Acronym is Required',
    validate: [(email) => email.length === 3, 'Please input exactly 3 characters']
  },
  fixtures: [{
    type: ObjectId,
    ref: 'Fixture'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

teamSchema.pre('save', function (next) {
  this.updatedAt = Date.now()

  return next()
})

/**
 * Team Model Table.
 */
const TeamModel = model('Team', teamSchema)

export default TeamModel
