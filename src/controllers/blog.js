const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  try {
    if (blog.likes === undefined) {
      blog.likes = 0
    }

    const newBlog = await blog.save()
    response.json(newBlog)
  } catch (error) {
    console.log(error.name)
    next(error)
  }
})

module.exports = blogsRouter
