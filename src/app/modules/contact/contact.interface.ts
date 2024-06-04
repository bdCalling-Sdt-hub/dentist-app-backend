import { Model } from 'mongoose'

export type IContact = {
  contact: string
  email: string
}

export type ContactModel = Model<IContact, Record<string, unknown>>
