import { Model } from 'mongoose';

export type IAdmin = {
  name: string;
  contactNo: string;
  age: number;
  dateOfBirth: string;
  profile: string;
};

export type AdminModel = {} & Model<IAdmin>;
