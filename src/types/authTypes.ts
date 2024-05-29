export type IChangePassword = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type IResetPassword = {
  newPassword: string
  confirmPassword: string
}
