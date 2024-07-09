import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgan';
const app: Application = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//parser
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

//app router
app.use('/api/v1', router);

//static file check
app.use(express.static('uploads'));

//server response
app.get('/', (req, res: Response) => {
  res.send(
    "<h1 style='font-family: Arial, sans-serif;text-align:center;color:#A08589'>Hey! I m front man of dentist, how can i assist you!</h1>",
  );
});

//global error handler
app.use(globalErrorHandler);

//handle not found route
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API NOT FOUND',
      },
    ],
  });
});

export default app;
