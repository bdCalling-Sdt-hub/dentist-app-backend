import { StatusCodes } from 'http-status-codes';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../types/common';
import { IPaginationOptions } from '../../../types/pagination';
import unlinkFile from '../../../util/unlinkFile';
import { Notification } from '../notification/notification.model';
import { IArticle, IArticleFilterOptions } from './article.interface';
import { Article } from './article.model';

const createArticleToDB = async (payload: IArticle): Promise<IArticle> => {
  const createArticle = await Article.create(payload);

  if (!createArticle) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created article');
  }

  //notification create
  //@ts-ignore
  const socketIo = global.io;
  const createNotification = await Notification.create({
    message: 'A new post has been published.',
    role: 'patient',
    type: 'article',
  });

  if (socketIo) {
    socketIo.emit('patient-notifications', createNotification);
  }

  return createArticle;
};

const getAllArticleFromDB = async (
  paginationOptions: IPaginationOptions,
  filterOptions: IArticleFilterOptions,
): Promise<IGenericResponse<IArticle[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const { search } = filterOptions;

  let searchConditions = {};
  if (search) {
    searchConditions = {
      $or: [
        {
          articleName: {
            $regex: search,
            $options: 'i',
          },
        },
      ],
    };
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Article.find(searchConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Article.countDocuments(searchConditions);
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

const getAllArticleByCategoryFromDB = async (
  category: string,
  paginationOptions: IPaginationOptions,
  filterOptions: IArticleFilterOptions,
): Promise<IGenericResponse<IArticle[]>> => {
  if (!category) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give article category name',
    );
  }
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const { search } = filterOptions;
  let andConditions = [];

  //find match article
  andConditions.push({ articleCategory: category });

  //search
  if (search) {
    andConditions.push({
      $or: ['articleName'].map(filed => ({
        [filed]: {
          $regex: search,
          $options: 'i',
        },
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Article.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Article.countDocuments(whereConditions);
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

const getSingleArticleFromDB = async (id: string): Promise<IArticle | null> => {
  const isExistArticle = await Article.findById(id);
  if (!isExistArticle) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Article doesn't exist!");
  }

  return isExistArticle;
};

const updateArticleToDB = async (
  id: string,
  payload: Partial<IArticle> & { imageToDelete?: string[] },
): Promise<IArticle | null> => {
  const isExistArticle = await Article.findById(id);
  if (!isExistArticle) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Article doesn't exist!");
  }

  const updateImages = isExistArticle.articleSlider.filter(
    image => !payload.imageToDelete?.includes(image),
  );

  //multiple file unlink here
  if (payload.imageToDelete!.length > 0) {
    for (let image of payload.imageToDelete!) {
      unlinkFile(image);
    }
  }
  //file unlink here
  if (payload.buttonImage) {
    unlinkFile(isExistArticle.buttonImage);
  }

  if (payload.articleSlider!.length > 0) {
    updateImages.push(...payload.articleSlider!);
  }

  const updateData = {
    ...payload,
    articleSlider:
      updateImages.length > 0 ? updateImages : isExistArticle.articleSlider,
  };

  const result = await Article.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  return result;
};

const deleteArticleToDB = async (id: string): Promise<IArticle | null> => {
  const isExist = await Article.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Article doesn't exist!");
  }
  //unlink file from local
  for (let image of isExist.articleSlider) {
    unlinkFile(image);
  }
  unlinkFile(isExist.buttonImage);

  const result = await Article.findByIdAndDelete(id);
  return result;
};

export const ArticleService = {
  createArticleToDB,
  getAllArticleFromDB,
  deleteArticleToDB,
  getSingleArticleFromDB,
  getAllArticleByCategoryFromDB,
  updateArticleToDB,
};
