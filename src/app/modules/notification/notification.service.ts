import { Notification } from './notification.model'

const getAllNotificationFromDB = async (role: string) => {
  const result = await Notification.find({ role: { $eq: role } })

  return result
}

export const NotificationService = {
  getAllNotificationFromDB,
}
