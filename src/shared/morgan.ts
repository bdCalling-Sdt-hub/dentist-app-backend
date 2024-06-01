import morgan from 'morgan'
import config from '../config'
import { errorLogger, logger } from './logger'

morgan.token('message', (req, res) => res?.locals.errorMessage || '')

const getIpFormat = () =>
  config.env === 'development' ? ':remote-addr - ' : ''
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: message => logger.info(message.trim()) },
})

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: message => errorLogger.error(message.trim()) },
})

export const Morgan = { errorHandler, successHandler }
