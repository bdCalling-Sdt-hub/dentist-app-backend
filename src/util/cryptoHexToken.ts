import crypto from 'crypto'

const cryptoHexToken = () => {
  const token = crypto.randomBytes(32).toString('hex')
  return token
}

export default cryptoHexToken
