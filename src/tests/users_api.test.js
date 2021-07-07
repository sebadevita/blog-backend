const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    username: 'sebita',
    name: 'Sebastian',
    password: 'banana123'
  },
  {
    username: 'andylarquy',
    name: 'Andres',
    password: 'mandarina123'
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

afterAll(() => {
  mongoose.connection.close()
})
