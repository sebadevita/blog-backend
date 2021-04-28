const app = require('./app')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

module.exports = {
  app,
  server
}
