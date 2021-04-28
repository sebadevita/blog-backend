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
  try {
    const blog = new Blog(request.body)

    if (blog.likes === undefined) {
      blog.likes = 0
    }

    const newBlog = await blog.save()
    response.status(200).json(newBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
