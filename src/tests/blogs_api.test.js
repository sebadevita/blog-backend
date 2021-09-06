const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../../app')

const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

// Token variables

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const adminUser = await new User({
    username: 'admin',
    passwordHash: 'secret'
  }).save()

  const userForToken = {
    id: adminUser.id,
    username: adminUser.username
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  await Promise.all(
    helper.initialBlogs.map((blog) => {
      blog.user = adminUser.id
      return new Blog(blog).save()
    })
  )
})

describe('Blogs', () => {
  test('are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('have a unique identifier named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('return 404 status code when the blog does not exist', async () => {
    await api.get('/api/blogs/inexistentBlog').expect(404)
  })
})

afterAll(() => mongoose.connection.close())
