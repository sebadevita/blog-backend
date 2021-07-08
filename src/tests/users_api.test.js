const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    username: 'sebita',
    name: 'Sebastian',
    passwordHash: 'banana123'
  },
  {
    username: 'andylarquy',
    name: 'Andres',
    passwordHash: 'mandarina123'
  }
]
describe('get users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user1 = new User(initialUsers[0])
    await user1.save()
    const user2 = new User(initialUsers[1])
    await user2.save()
  })
  test('are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 2 users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('the first user is sebita', async () => {
    const response = await api.get('/api/users')

    const users = await response.body.map(user => user.username)

    expect(users).toContain('sebita')
  })
  test('the unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('create user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user1 = new User(initialUsers[0])
    await user1.save()
    const user2 = new User(initialUsers[1])
    await user2.save()
  })

  test('a valid user can be added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'newname',
      password: 'password123'

    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(initialUsers.length + 1)
  })

  test('without username is not added ', async () => {
    const userWithoutUsername = {
      name: 'User',
      password: 'banana123'
    }

    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('with username of 2 characters is not added ', async () => {
    const userWith2Characters = {
      username: 'us',
      name: 'User',
      password: 'banana123'
    }

    await api
      .post('/api/users')
      .send(userWith2Characters)
      .expect(400)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
