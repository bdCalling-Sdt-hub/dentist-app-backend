import nodemailer from 'nodemailer'
import config from '../config'
import { logger } from '../shared/logger'
import { ISendEmail } from '../types/emailTypes'

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
})

const sendMail = async (values: ISendEmail) => {
  const info = await transporter.sendMail({
    from: `"TOOTHLENS" ${config.email.from}`,
    to: values.to,
    subject: values.subject,
    html: values.html,
  })

  console.log('Mail', info.response)
  logger.info('MAIL SEND SUCCESSFULLY', info.accepted)
}

export const emailHelper = {
  sendMail,
}
