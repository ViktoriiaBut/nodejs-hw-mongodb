import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import router from "./routers/index.js";

export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', 3000));

    app.use(cors());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }));

    app.use(router);

    app.use((req, res) => {
      res.status(404).json({
       message: 'Not found',
      });
    });

 app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
