const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/userExtractor')

// Helper

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  // const body = request.body

  const {
    title,
    author,
    url,
    likes
    // userId
  } = request.body

  // const token = getTokenFrom(request)

  const { userId } = request

  try {
    const user = await User.findById(userId)

    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id
    })

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

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  // console.log(userId)

  // if (blog.user.toString() !== userId) {
  //   response.status(403)
  // }

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

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
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
