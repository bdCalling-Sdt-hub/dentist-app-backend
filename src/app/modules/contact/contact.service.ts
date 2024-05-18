import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IContact } from './contact.interface'
import { Contact } from './contact.model'

const createContactToDB = async (payload: IContact): Promise<IContact> => {
  const createContact = await Contact.create(payload)
  if (!createContact) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create contact')
  }
  return createContact
}

const getContactFromDB = async (): Promise<IContact | null> => {
  const result = await Contact.findOne()
  return result
}

const updateContactToDB = async (
  id: string,
  payload: IContact,
): Promise<IContact> => {
  const contact = await Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  if (!contact) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Contact doesn't exist")
  }
  return contact
}

export const PackageService = {
  createContactToDB,
  getContactFromDB,
  updateContactToDB,
}
