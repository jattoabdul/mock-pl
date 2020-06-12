// import { Schema, model } from 'mongoose'
// import { generateId } from '../utils/helpers'
//
// const { ObjectId } = Schema.Types
//
// /**
//  * User Model Schema.
//  */
// const fixtureSchema = new Schema({
//   key: {
//     unique: true,
//     type: Number,
//     default: generateId()
//   },
//   stage: String,
//   status: String,
//   schedule: {
//     matchDay: Date,
//     gameWeek: Date,
//     startTime: Date,
//     endTime: Date
//   },
//   homeTeam: {
//     type: ObjectId,
//     ref: 'Team'
//   },
//   awayTeam: {
//     type: ObjectId,
//     ref: 'Team'
//   },
//   homeScore: {
//     goal: Number,
//     extraGoal: Number,
//     penalty: Number
//   },
//   awayScore: {
//     goal: Number,
//     extraGoal: Number,
//     penalty: Number
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date
//   }
// })
//
// fixtureSchema.pre('save', function (next) {
//   this.updatedAt = Date.now()
//
//   return next()
// })
//
// /**
//  * Fixture Model Table.
//  */
// const FixtureModel = model('Team', fixtureSchema)
//
// export default FixtureModel
