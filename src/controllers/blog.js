const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const idBlog = request.params.id

  try {
    const blog = await Blog.findById(idBlog).populate('user', {
      username: 1,
      name: 1
    })
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = await User.findById(request.userId)

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await newBlog.save()

    // A los blogs que ya tenía, le asigno un nuevo blog
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const idBlog = request.params.id

    const blog = await Blog.findById(idBlog)

    const { userId } = request

    if (blog && blog.user.toString() !== userId.toString()) {
      response.status(401).send({ error: 'The user does not have permissions' })
    }

    await Blog.findByIdAndDelete(idBlog)
    response.status(200).json({ msg: 'The blog was deleted!' })
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
