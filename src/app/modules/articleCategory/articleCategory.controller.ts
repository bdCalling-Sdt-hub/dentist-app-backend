import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ArticleCategoryService } from './articleCategory.service';

const createArticleCategory = catchAsync(
  async (req: Request, res: Response) => {
    let articleCategoryImage = '';
    if (
      req.files &&
      'articleCategoryImage' in req.files &&
      req.files.articleCategoryImage[0]
    ) {
      articleCategoryImage = `/images/${req.files.articleCategoryImage[0].filename}`;
    }
    const data = {
      ...req.body,
      articleCategoryImage,
    };
    const result = await ArticleCategoryService.createArticleCategoryToDB(data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Article category created successfully',
      data: result,
    });
  },
);

const getAllArticleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ArticleCategoryService.getAllArticleCategoryFromDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Article category retrieved successfully',
      data: result,
    });
  },
);

const updateArticleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id);
    let articleCategoryImage;
    if (
      req.files &&
      'articleCategoryImage' in req.files &&
      req.files.articleCategoryImage[0]
    ) {
      articleCategoryImage = `/images/${req.files.articleCategoryImage[0].filename}`;
    }
    const data = {
      ...req.body,
      articleCategoryImage,
    };
    console.log(data);
    const result = await ArticleCategoryService.updateArticleCategoryToDB(
      id,
      data,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Article category updated successfully',
      data: result,
    });
  },
);

const deleteArticleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ArticleCategoryService.deleteArticleCategoryToDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Article category deleted successfully',
      data: result,
    });
  },
);

export const ArticleCategoryController = {
  createArticleCategory,
  getAllArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
};
