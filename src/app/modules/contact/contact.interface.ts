import { Model } from 'mongoose'

export type IContact = {
  contact: string
}

export type ContactModel = Model<IContact, Record<string, unknown>>
