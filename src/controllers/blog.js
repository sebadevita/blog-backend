const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  // const body = request.body

  const {
    title,
    author,
    url,
    likes,
    userId
  } = request.body

  const user = await User.findById(userId)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  try {
    if (blog.likes === undefined) {
      blog.likes = 0
    }

    const newBlog = await blog.save()

    // A los blogs que ya tenía, le asigno un nuevo blog
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()

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
