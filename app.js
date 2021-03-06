const config = require('./src/utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./src/controllers/blog')
const usersRouter = require('./src/controllers/user')
const loginRouter = require('./src/controllers/login')
const middleware = require('./src/utils/middleware')
const logger = require('./src/utils/logger')
const mongoose = require('mongoose')

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // en true rompe los test
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
