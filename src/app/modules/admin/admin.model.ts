import { model, Schema } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';

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
      default: 'https://i.postimg.cc/SsDP2qqv/profile.png',
    },
  },
  { timestamps: true },
);

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
