import { Schema, model } from 'mongoose'

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
    uppercase: true,
    unique: true,
    trim: true,
    required: 'Team Acronym is Required',
    validate: [(email) => email.length === 3, 'Please input exactly 3 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

teamSchema.pre('save', function (next) {
  const team = this
  team.updatedAt = Date.now()

  return next()
})

teamSchema.index({ acronym: 1 }, { key: 'acronym', unique: true })
/**
 * Team Model Table.
 */
const TeamModel = model('Team', teamSchema)

export default TeamModel
