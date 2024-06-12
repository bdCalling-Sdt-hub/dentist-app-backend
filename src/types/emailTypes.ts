export type ISendEmail = {
  to: string
  subject: string
  html: string
}

export type IForgetPasswordTemplate = {
  email: string
  otp: string
}

export type ICreatePatientTemplate = {
  name: string
  email: string
  password: string
}
