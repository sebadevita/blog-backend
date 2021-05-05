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
    console.log('El ID ES ESTE', idBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
