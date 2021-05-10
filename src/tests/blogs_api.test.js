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
describe('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blog1 = new Blog(initialBlogs[0])
    await blog1.save()
    const blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })
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

    const titles = await response.body.map(blog => blog.title)

    expect(titles).toContain('Seba Blog')
  })
  test('the unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('create a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blog1 = new Blog(initialBlogs[0])
    await blog1.save()
    const blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })
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

  test('when do not receive likes the default value is zero', async () => {
    const blogWithoutLikes = {
      title: 'Blog without likes',
      author: 'warren',
      url: 'https://twitter.com/warrensanchez'
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // const response = await api.get('/api/blogs')
    // const likesList = response.body.map(blog => blog.likes)
    // expect(likesList).toContain(0)
    const result = await Blog.findOne({ title: 'Blog without likes' })

    expect(result.likes).toBe(0)
  })

  test('blog without title is not added ', async () => {
    const blogWithoutTitle = {
      author: 'sebita',
      url: 'https://twitter.com/Sebadevita',
      likes: 100

    }

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const blogWithoutUrl = {
      title: 'Seba Blog',
      author: 'sebita',
      likes: 100
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('delete a blog', () => {
  let blog1
  let blog2

  beforeEach(async () => {
    await Blog.deleteMany({})
    blog1 = new Blog(initialBlogs[0])
    await blog1.save()
    blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })

  test('a blog can be deleted', async () => {
    await api
      .delete(`/api/blogs/${blog1.id}`)
      .expect(204)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })
})

describe('update a blog', () => {
  let blog1
  let blog2

  beforeEach(async () => {
    await Blog.deleteMany({})
    blog1 = new Blog(initialBlogs[0])
    await blog1.save()
    blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })

  test('a valid blog can be updated', async () => {
    const updatedBlog = {
      title: 'Updated Blog',
      author: 'sebita updated',
      url: 'https://twitter.com/Sebadevita',
      likes: 50

    }
    await api
      .put(`/api/blogs/${blog1.id}`)
      .send(updatedBlog)
      .expect(200)

    const result = await Blog.findOne({ title: 'Updated Blog' })

    expect(result.title).toBe('Updated Blog')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
