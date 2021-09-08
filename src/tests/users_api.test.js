const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../../app')

const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'admin', passwordHash })

  await user.save()
})

describe('Creating new user', () => {
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

    const usernames = usersAtEnd.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with a username that already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'admin',
      name: 'sebastian',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with a username shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'a',
      name: 'sebastian',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('fails without username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'sebastian',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => mongoose.connection.close())
