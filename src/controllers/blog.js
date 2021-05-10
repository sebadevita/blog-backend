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
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const idBlog = request.params.id

  try {
    await Blog.findByIdAndDelete(idBlog)
    response.status(204).json({ msg: 'The blog was deleted!' })
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const updatedBlog = request.body
  const idBlog = request.params.id

  const blog = {
    title: updatedBlog.title,
    author: updatedBlog.author,
    url: updatedBlog.url,
    likes: updatedBlog.likes

  }

  try {
    await Blog.findByIdAndUpdate(idBlog, blog, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
