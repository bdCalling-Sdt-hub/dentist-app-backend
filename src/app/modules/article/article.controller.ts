import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { paginationFields } from '../../../shared/constant';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ArticleService } from './article.service';

const createArticle = catchAsync(async (req: Request, res: Response) => {
  let buttonImage = '';
  const articleSlider: string[] = [];
  if (req.files && 'buttonImage' in req.files && req.files.buttonImage[0]) {
    buttonImage = `/images/${req.files.buttonImage[0].filename}`;
  }

  if (req.files && 'articleSlider' in req.files && req.files.articleSlider) {
    for (let image of req.files.articleSlider) {
      articleSlider.push(`/images/${image.filename}`);
    }
  }

  const payload = {
    ...req.body,
    buttonImage,
    articleSlider,
  };

  const result = await ArticleService.createArticleToDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Article created successfully!',
    data: result,
  });
});

const getAllArticle = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, ['search']);
  const result = await ArticleService.getAllArticleFromDB(
    paginationOptions,
    filterOptions,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Article retrieved successfully!',
    pagination: result.meta,
    data: result.data,
  });
});

const getAllArticleByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationFields);
    const filterOptions = pick(req.query, ['search']);
    const category = req.params.category_name;
    const result = await ArticleService.getAllArticleByCategoryFromDB(
      category,
      paginationOptions,
      filterOptions,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'All Article retrieved successfully!',
      pagination: result.meta,
      data: result.data,
    });
  },
);

const getSingleArticle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ArticleService.getSingleArticleFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single Article retrieved successfully!',
    data: result,
  });
});

const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  let buttonImage;
  const articleSlider: string[] = [];
  if (req.files && 'buttonImage' in req.files && req.files.buttonImage[0]) {
    buttonImage = `/images/${req.files.buttonImage[0].filename}`;
  }

  if (req.files && 'articleSlider' in req.files && req.files.articleSlider) {
    for (let image of req.files.articleSlider) {
      articleSlider.push(`/images/${image.filename}`);
    }
  }

  const payload = {
    buttonImage,
    articleSlider,
    ...req.body,
  };

  console.log('article', payload);

  const result = await ArticleService.updateArticleToDB(id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Article updated successfully!',
    data: result,
  });
});

const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ArticleService.deleteArticleToDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Article deleted successfully!',

    data: result,
  });
});

export const ArticleController = {
  createArticle,
  getAllArticle,
  deleteArticle,
  getSingleArticle,
  getAllArticleByCategory,
  updateArticle,
};
