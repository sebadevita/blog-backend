const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../../app')

const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

// Token variables

let token
let noBlogsToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

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

  test('can be updated', async () => {
    const allBlogsInDb = await helper.blogsInDb()
    const blogToBeUpdated = allBlogsInDb[0]

    const updatedData = {
      likes: 100
    }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updatedData)
      .set('Authorization', `bearer ${token}`)
      .expect(200)

    expect(updatedBlog.body.likes).toBe(updatedData.likes)
  })

  test('cannot be deleted if the blog was not created by the same user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${noBlogsToken}`)
      .expect(401)
  })

  test('can be deleted if the blog was created by the same user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
  })

  test('cannot be added without a valid user token', async () => {
    const newBlog = {
      title: 'new Blog',
      author: 'Sebita',
      utl: 'http://www.test.com',
      likes: 10
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })
  test('can be added with a valid user token', async () => {
    const newBlog = {
      title: 'Just an example blog title',
      author: 'John Doe',
      url: 'http://www.example.com',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
  test('are assigned 0 likes if "likes" property is missing from request', async () => {
    const newBlog = {
      title: 'Example blog title',
      author: 'John Doe',
      url: 'http://www.example.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(response.body.likes).toBe(0)
  })
})

afterAll(() => mongoose.connection.close())
