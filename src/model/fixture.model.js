import { Schema, model } from 'mongoose'
import { v1 as uuid } from 'uuid'

const { ObjectId } = Schema.Types

/**
 * User Model Schema.
 */
const fixtureSchema = new Schema({
  key: {
    unique: true,
    type: String
  },
  schedule: {
    matchDay: {
      type: Date,
      required: 'Match Day is required'
    },
    gameWeek: {
      type: Number,
      required: 'Game Week is required'
    }
  },
  homeTeam: {
    type: ObjectId,
    required: 'Home Team is required',
    ref: 'Team'
  },
  awayTeam: {
    type: ObjectId,
    required: 'Home Team is required',
    ref: 'Team'
  },
  homeScore: {
    goal: Number,
    extraGoal: Number,
    penalty: Number
  },
  awayScore: {
    goal: Number,
    extraGoal: Number,
    penalty: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

fixtureSchema.pre('save', function (next) {
  this.updatedAt = Date.now()

  return next()
})

fixtureSchema.methods.generateNewKey = () => {
  return uuid()
}

fixtureSchema.index({ homeTeam: 1, awayTeam: 1 }, { key: 'home_and_away_team', unique: true })
fixtureSchema.index({ awayTeam: 1, homeTeam: 1 }, { key: 'away_and_home_team', unique: true })

/**
 * Fixture Model Table.
 */
const FixtureModel = model('Fixture', fixtureSchema)

export default FixtureModel
