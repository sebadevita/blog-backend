const http = require("http")
const express = require("express")
const app = require('./app')
const cors = require("cors")
const mongoose = require("mongoose")

const Blog = require('./src/models/blog')
const logger = require('./src/utils/logger')
const config = require('./src/utils/config')

app.use(cors())
app.use(express.json())

PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
