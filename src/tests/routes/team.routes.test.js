import supertest from 'supertest'

import { app } from '../../server'
import { disconnectedDB } from '../test-setup'
import { createSession } from '../test-helper'
// import config from '../../config'
// import TeamModel from '../../model/team.model'
import { v1 as uuid } from 'uuid'
import UserModel from '../../model/user.model'
import { createToken } from '../../utils/helpers'

const request = supertest(app)

// Setup a Test Database
// const dbName = `mockpl_${config.environment}`
// setupDB(`${dbName}_team`)
// setupDB(dbName)
disconnectedDB()

/**
 * Auth Route Tests.
 */
describe('Auth Routes', () => {
  describe('POST /api/v1/teams', () => {
    describe('Authorized Admin', () => {
      it('should create team', async (done) => {
        const user = new UserModel({
          name: 'John Admin',
          email: 'teamadmin@gmail.com',
          password: 'adminpassword',
          role: 'admin',
          accessToken: uuid()
        })
        await user.save()

        // Get admin user in the database
        const adminUser = await UserModel.findOne({ email: 'teamadmin@gmail.com' })
        expect(adminUser.role).toEqual('admin')

        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'teamadmin@gmail.com', password: 'adminpassword' })
        const cookie = agent
          .headers['set-cookie'][1] // TODO: figure out why not the first value[0]
          .split(',')
          .map(item => item.split(';')[0])

        // generate JWT token and add to request header Authorization
        const token = createToken({
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          authKey: adminUser.accessToken
        })

        const res = await request
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${token}`)
          .set('Cookie', cookie)
          .send({
            name: 'Dream Team',
            acronym: 'DMT'
          })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.team.acronym).toEqual('DMT')
        done()
      })
    })
  })
})
