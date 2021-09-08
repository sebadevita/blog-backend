
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  // if (password.length <= 3) {
  //   return response
  //     .status(400)
  //     .json({ error: 'password have to be at least 3 characters long' })
  // }

  try {
    const savedUser = await user.save()

    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({}).populate('blogs')
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
