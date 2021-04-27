const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Seba Blog',
    author: 'sebita',
    url: 'https://twitter.com/Sebadevita',
    likes: 100

  },
  {
    title: 'Andy Blog',
    author: 'andy',
    url: 'https://twitter.com/Sebadevita',
    likes: 100
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blog1 = new Blog(initialBlogs[0])
  blog1.save()
  const blog2 = new Blog(initialBlogs[1])
  blog2.save()
})
describe('blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 2 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('the first blog is about Seba', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    expect(titles).toContain('Seba Blog')
  })
})
afterAll(() => {
  mongoose.connection.close()
})
