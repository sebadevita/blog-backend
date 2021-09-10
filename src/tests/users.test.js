const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../../app')

const api = supertest(app)

const User = require('../models/user')

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'admin', passwordHash })

    await user.save()
  })
  test('succeeds with a correct username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sebita',
      name: 'sebastian',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })
})

afterAll(() => mongoose.connection.close())
