export type ISendEmail = {
  to: string
  subject: string
  html: string
}

export type IForgetPasswordTemplate = {
  email: string
  otp: string
}
