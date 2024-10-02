import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import boardRoutes from "./routes/boardRoutes";
import boardListRoutes from "./routes/boardListsRoutes";
import listCardRoutes from "./routes/listCardsRoutes";
import errorHandler from './middleware/errorHandler';
import { protect } from './middleware/authMiddleware';

const app: Application = express();

// Middleware.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/users', userRoutes);

// Protected Routes.
app.use(protect)
app.use('/api/board', boardRoutes);
app.use('/api/boardList', boardListRoutes);
app.use('/api/cards', listCardRoutes);

// 404 Handler (Place before errorHandler)
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404);
    next(new Error('Not Found'));
  }
);

// Error Handling Middleware
app.use(errorHandler);

export default app;
