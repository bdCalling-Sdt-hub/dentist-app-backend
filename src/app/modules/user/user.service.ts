import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder, startSession } from 'mongoose';
import { USER_TYPE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { selectedUserField } from '../../../shared/constant';
import { emailTemplate } from '../../../shared/emailTemplate';
import { IGenericResponse } from '../../../types/common';
import { ICreatePatientTemplate } from '../../../types/emailTypes';
import { IPaginationOptions } from '../../../types/pagination';
import { Admin } from '../admin/admin.model';
import { IPatient, IPatientFilterOptions } from '../patient/patient.interface';
import { Patient } from '../patient/patient.model';
import { IUser } from './user.interface';
import { User } from './user.model';
type IUserPayload = IUser & IPatient;

//patient management
const createPatientToDB = async (payload: IUserPayload) => {
  const { email, password, pin, ...patientData } = payload;
  const user: Partial<IUser> = {
    email,
    password,
    pin,
    role: 'patient',
  };

  let newUserData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createPatient = await Patient.create([patientData], { session });
    if (!createPatient.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create patient');
    }

    user.patient = createPatient[0]._id;
    const createUser = await User.create([user], { session });
    if (!createUser.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    newUserData = createUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(StatusCodes.BAD_REQUEST, error?.message);
  }

  return newUserData;
};

//send email to patient
const sendEmailFromDB = async (payload: ICreatePatientTemplate) => {
  const emailData = emailTemplate.createPatient(payload);
  emailHelper.sendMail(emailData);
};

const getAllPatientFromDB = async (
  paginationOptions: IPaginationOptions,
  filterOptions: IPatientFilterOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const { search, category } = filterOptions;

  const andConditions = [];
  if (search) {
    const patineIds = await Patient.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { contactNo: { $regex: search, $options: 'i' } },
        { gender: { $regex: search, $options: 'i' } },
        { plan: { $regex: search, $options: 'i' } },
      ],
    }).distinct('_id');

    andConditions.push({
      $or: [
        { patient: { $in: patineIds } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });
  }
  andConditions.push({ role: USER_TYPE.PATIENT, status: { $ne: 'delete' } });

  if (category) {
    const categoryIds = await Patient.find({ category: category }).distinct(
      '_id',
    );
    andConditions.push({ $and: [{ patient: { $in: categoryIds } }] });
  }

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await User.find(whereConditions)
    .sort(sortCondition)
    .populate('patient')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  };
};

//admin management
const createAdminToDB = async (payload: IUserPayload) => {
  const { email, password, ...adminData } = payload;
  const user: Partial<IUser> = {
    email,
    password,
    role: 'admin',
  };

  let newUserData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createAdmin = await Admin.create([adminData], { session });
    if (!createAdmin.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }

    user.admin = createAdmin[0]._id;
    const createUser = await User.create([user], { session });
    if (!createUser.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    newUserData = createUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(StatusCodes.BAD_REQUEST, error?.message);
  }

  return newUserData;
};

const getAllAdminFromDB = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const result = await User.find({ role: USER_TYPE.ADMIN })
    .populate({ path: 'admin', select: '-createdAt -updatedAt -__v' })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role: USER_TYPE.ADMIN });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      totalPage,
      total,
    },
    data: result,
  };
};

const deleteAdminFromDB = async (id: string): Promise<IUser | null> => {
  let deleteAdminUser;
  const session = await startSession();
  try {
    session.startTransaction();
    const findUser = await User.isUserExistById(id);
    if (!findUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist");
    }

    const deleteAdmin = await Admin.findByIdAndDelete(findUser.admin).session(
      session,
    );
    deleteAdminUser = await User.findByIdAndDelete(id).session(session);

    if (!deleteAdminUser || !deleteAdmin) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist");
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(StatusCodes.BAD_REQUEST, error?.message);
  }
  return deleteAdminUser;
};

//profile
const getProfileFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({ _id: payload.id }).populate([
    { path: 'patient', select: selectedUserField },
    { path: 'admin', select: selectedUserField },
  ]);

  return result;
};

//Analysis
const userAnalysisFromDB = async () => {
  const aggregate = await User.aggregate([
    {
      $match: { role: 'patient' },
    },
    {
      $group: { _id: null, totalPatient: { $sum: 1 } },
    },
  ]);
  const totalPatient = aggregate[0].totalPatient;

  //monthly register user
  const currentYear = new Date().getFullYear();
  const months = [
    { name: 'Jan', user: 0 },
    { name: 'Feb', user: 0 },
    { name: 'Mar', user: 0 },
    { name: 'Apr', user: 0 },
    { name: 'May', user: 0 },
    { name: 'Jun', user: 0 },
    { name: 'Jul', user: 0 },
    { name: 'Aug', user: 0 },
    { name: 'Sep', user: 0 },
    { name: 'Oct', user: 0 },
    { name: 'Nov', user: 0 },
    { name: 'Dec', user: 0 },
  ];

  const totalRegisterUsers = await User.aggregate([
    { $match: { role: 'patient' } },
    {
      $project: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
    },
    { $match: { year: currentYear } },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        totalUser: { $sum: 1 },
      },
    },
  ]);

  let totalPatientThisYear = 0;
  totalRegisterUsers.forEach(u => {
    const monthIndex = u._id.month - 1;
    months[monthIndex].user = u.totalUser;
    totalPatientThisYear += u.totalUser;
  });

  //calculate the percentage
  const percentage = Math.round((totalPatientThisYear / totalPatient) * 100);

  return {
    usersOverview: {
      totalPatient,
      percentage,
    },
    yearlyUserOverview: months,
  };
};

//delete user
const deleteUserToDB = async (id: string) => {
  const isExistUser = await User.findOne({ _id: id });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //delete user
  await User.deleteUser(isExistUser._id.toString());
};

//admin management
const createSuperAdminToDB = async (payload: IUserPayload) => {
  const { email, password, ...adminData } = payload;
  const user: Partial<IUser> = {
    email,
    password,
    role: 'super_admin',
  };

  let newUserData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createAdmin = await Admin.create([adminData], { session });
    if (!createAdmin.length) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create super admin',
      );
    }

    user.admin = createAdmin[0]._id;
    const createUser = await User.create([user], { session });
    if (!createUser.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    newUserData = createUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(StatusCodes.BAD_REQUEST, error?.message);
  }

  return newUserData;
};

export const UserService = {
  createPatientToDB,
  getProfileFromDB,
  createAdminToDB,
  getAllAdminFromDB,
  getAllPatientFromDB,
  deleteAdminFromDB,
  sendEmailFromDB,
  deleteUserToDB,
  userAnalysisFromDB,
  createSuperAdminToDB,
};
