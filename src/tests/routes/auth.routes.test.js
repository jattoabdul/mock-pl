import supertest from 'supertest'

import { app } from '../../server'
import { setupDB } from '../test-setup'
import { createSession } from '../test-helper'
import config from '../../config'
import UserModel from '../../model/user.model'
import { v1 as uuid } from 'uuid'
import { createToken } from '../../utils/helpers'

const dbName = `mockpl_${config.environment}`
const request = supertest(app)

// Setup a Test Database
setupDB(dbName)

/**
 * Auth Route Tests.
 */
describe('Auth Routes', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user', async (done) => {
      const res = await request
        .post('/api/v1/auth/signup')
        .send({
          name: 'John Doe',
          email: 'testing@gmail.com',
          password: 'validpassword'
        })

      // Searches the user in the database
      const user = await UserModel.findOne({ email: 'testing@gmail.com' })

      // DB Assertions
      expect(user.name).toBeTruthy()
      expect(user.email).toBeTruthy()
      expect(user.name).toEqual('John Doe')

      // Response Assertions
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('success')
      expect(res.body).toHaveProperty('payload')
      done()
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should signin a new user', async (done) => {
      const user = new UserModel({
        name: 'John Doe',
        email: 'testing@gmail.com',
        password: 'validpassword'
      })
      await user.save()

      const res = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'testing@gmail.com',
          password: 'validpassword'
        })

      // Response Assertions
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('success')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.user.email).toEqual('testing@gmail.com')
      done()
    })
  })

  describe('PUT /api/v1/auth/toggle/role', () => {
    describe('Authorized Admin', () => {
      it('should toggle user role', async (done) => {
        const users = [
          {
            name: 'John Doe',
            email: 'testing@gmail.com',
            password: 'validpassword',
            accessToken: uuid()
          },
          {
            name: 'John Admin',
            email: 'admin@gmail.com',
            password: 'adminpassword',
            role: 'admin',
            accessToken: uuid()
          }
        ]

        // Add users to the database
        for (const u of users) {
          const user = new UserModel(u)
          await user.save()
        }

        // Get regular user in the database
        const testUser = await UserModel.findOne({ email: 'testing@gmail.com' })
        expect(testUser.role).toEqual('customer')

        // Get admin user in the database
        const adminUser = await UserModel.findOne({ email: 'admin@gmail.com' })
        expect(adminUser.role).toEqual('admin')

        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'admin@gmail.com', password: 'adminpassword' })
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
          .put('/api/v1/auth/toggle/role')
          .set('Authorization', `Bearer ${token}`)
          .set('Cookie', cookie)
          .send({
            email: testUser.email,
            role: 'admin'
          })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.user.role).toEqual('admin')
        done()
      })
    })
  })

  describe('DELETE /api/v1/auth/signout', () => {
    describe('Authorized User', () => {
      it('should destroy user session', async (done) => {
        // Add users to the database
        const user = new UserModel({
          name: 'John Admin',
          email: 'admin@gmail.com',
          password: 'adminpassword',
          role: 'admin',
          accessToken: uuid()
        })
        await user.save()

        // Get admin user in the database
        const adminUser = await UserModel.findOne({ email: 'admin@gmail.com' })
        expect(adminUser.accessToken).toBeTruthy()

        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'admin@gmail.com', password: 'adminpassword' })
        const cookie = agent
          .headers['set-cookie'][1] // TODO: figure out why not the first value[0]
          .split(',')
          .map(item => item.split(';')[0])
        expect(cookie).toBeTruthy()

        const res = await request
          .delete('/api/v1/auth/logout')
          .set('Cookie', cookie)

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.message).toEqual('User Logged Out. Bye! 👋🏽')
        expect(res.text).toBeTruthy()
        done()
      })
    })
  })
})
