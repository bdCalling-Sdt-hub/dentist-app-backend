import { model, Schema } from 'mongoose'
import { IPackage, PackageModel } from './package.interface'

const packageSchema = new Schema<IPackage, PackageModel>(
  {
    packageName: {
      type: String,
      required: true,
    },
    packageDetails: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
)

export const Package = model<IPackage, PackageModel>('Package', packageSchema)
