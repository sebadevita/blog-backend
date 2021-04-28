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
  test('the unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('post a blog', () => {
  test('a valid post can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'sebita',
      url: 'https://twitter.com/Sebadevita',
      likes: 50

    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })
})
afterAll(() => {
  mongoose.connection.close()
})
