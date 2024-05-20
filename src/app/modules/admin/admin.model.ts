import { model, Schema } from 'mongoose'
import { AdminModel, IAdmin } from './admin.interface'

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: 0,
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', ''],
      default: '',
    },
    profile: {
      type: String,
      default:
        'https://huggingface.co/datasets/huggingfacejs/tasks/resolve/main/image-classification/image-classification-input.jpeg',
    },
  },
  { timestamps: true },
)

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema)
