import { model, Schema } from 'mongoose'
import { ISmartCheck, SmartCheckModel } from './smartCheck.interface'

const smartCheckSchema = new Schema<ISmartCheck, SmartCheckModel>(
  {
    smartCheckLink: {
      type: String,
      required: true,
    },
    smartCheckImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const SmartCheck = model<ISmartCheck, SmartCheckModel>(
  'SmartCheck',
  smartCheckSchema,
)
