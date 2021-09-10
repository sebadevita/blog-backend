
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  if (!body.username || !body.password) {
    return response
      .status(400)
      .json({ error: 'username and password fields are required' })
  } else if (body.username.length <= 3 || body.password.length <= 3) {
    return response
      .status(400)
      .json({ error: 'username and password have to be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  const idUser = request.params.id

  try {
    const user = await User.findById(idUser)
    response.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
