import colors from 'colors'
import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorLogger, logger } from './shared/logger'

//uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error(error)
  process.exit(1)
})

let server: any
async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(colors.green('♻️  Database connected successfully'))

    const port =
      typeof config.port === 'number' ? config.port : parseInt(config.port!)

    //app listen here
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(`🚀 Application Running on port:${config.port}`),
      )
    })
  } catch (error) {
    errorLogger.error(error)
  }

  //unhandle rejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

main()

//sigterm
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE')
  if (server) {
    server.close()
  }
})
