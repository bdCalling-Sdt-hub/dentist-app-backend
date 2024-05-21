import { Error } from 'mongoose'
import { IErrorMessage } from '../types/errorTypes'

const handleValidationError = (error: Error.ValidationError) => {
  const errors: IErrorMessage[] = Object.values(error.errors).map(
    (el: Error.ValidatorError | Error.CastError) => {
      return {
        path: el.path,
        message: el.message,
      }
    },
  )

  const statusCode = 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  }
}

export default handleValidationError
