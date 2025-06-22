import express from 'express';
import { json } from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import router from "./routers/index.js";
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', 3000));

    app.use(cors(), pino());
    // app.use(pino({
    //     transport: {
    //         target: 'pino-pretty',
    //     },
    // }));

    app.use(router);

    app.use(json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

    app.use(notFoundHandler);

 app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
