const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../../app')

const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

describe('Blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    let token
    let noBlogsToken

    const adminUser = await new User({
      username: 'admin',
      passwordHash: 'secret'
    }).save()

    const userWithNoBlogs = await new User({
      username: 'noBlogsUser',
      passwordHash: 'notSecret'
    }).save()

    const userForToken = {
      id: adminUser.id,
      username: adminUser.username
    }

    const userWithNoBlogsToken = {
      id: userWithNoBlogs.id,
      username: userWithNoBlogs.username

    }

    token = jwt.sign(userForToken, process.env.SECRET)
    noBlogsToken = jwt.sign(userWithNoBlogsToken, process.env.SECRET)

    await Promise.all(
      helper.initialBlogs.map((blog) => {
        blog.user = adminUser.id
        return new Blog(blog).save()
      })
    )
  })

  test('are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => mongoose.connection.close())
