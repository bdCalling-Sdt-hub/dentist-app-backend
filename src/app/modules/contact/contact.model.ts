import { model, Schema } from 'mongoose'
import { ContactModel, IContact } from './contact.interface'

const contactSchema = new Schema<IContact, ContactModel>(
  {
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Contact = model<IContact, ContactModel>('Contact', contactSchema)
