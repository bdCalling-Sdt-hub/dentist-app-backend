import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  ip_address: process.env.IP_ADDRESS,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire_in: process.env.JWT_EXPIRE_IN,
  },
}
