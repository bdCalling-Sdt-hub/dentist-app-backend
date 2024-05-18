import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { PackageService as ContactService } from './contact.service'

const createContact = catchAsync(async (req: Request, res: Response) => {
  const { ...contactData } = req.body
  const result = await ContactService.createContactToDB(contactData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contact created successfully',
    data: result,
  })
})

const getContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getContactFromDB()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  })
})

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const { ...updateContactData } = req.body
  const result = await ContactService.updateContactToDB(id, updateContactData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  })
})

export const ContactController = {
  createContact,
  getContact,
  updateContact,
}
