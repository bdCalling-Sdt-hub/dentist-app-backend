import { Request } from 'express'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import ApiError from '../../errors/ApiError'

const fileHandler = () => {
  //folder create
  const uploadDir = path.join(process.cwd(), 'uploads', 'images')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir)
    },
    filename(req, file, cb) {
      const fileExt = path.extname(file.originalname)
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now()
      cb(null, fileName + fileExt)
    },
  })

  const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true)
    } else {
      cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Only .jpg, .jpeg, .png file supported!',
        ),
      )
    }
  }

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5000000, //5MB
    },
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'profile', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
    { name: 'offerImage', maxCount: 1 },
    { name: 'articleCategoryImage', maxCount: 1 },
    { name: 'buttonImage', maxCount: 1 },
    { name: 'articleSlider', maxCount: 3 },
    { name: 'smartCheckImage', maxCount: 1 },
  ])

  return upload
}

export default fileHandler
