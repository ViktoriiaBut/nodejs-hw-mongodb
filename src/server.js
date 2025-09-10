import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';
import { authenticate } from './middlewares/authenticate.js';
import contactsRouter from './routers/contacts.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
    const app = express();

    app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  }));
    app.use(pino());
    app.use(express.json());
    app.use(cookieParser());

    app.use('/auth', authRouter);

    app.use('/contacts', authenticate, contactsRouter);

    app.use('/api-docs', swaggerDocs());

    app.use(notFoundHandler);

    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
