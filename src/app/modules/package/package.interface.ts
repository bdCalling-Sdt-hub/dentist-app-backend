import { Model } from 'mongoose'

export type IPackage = {
  packageName: string
  packageDetails: string[]
}

export type PackageModel = Model<IPackage, Record<string, unknown>>
