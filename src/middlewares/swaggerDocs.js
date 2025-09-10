import swaggerUI from 'swagger-ui-express';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import path from 'node:path';

export const swaggerDocs = () => {
    try {
        const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.json');
        const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
        return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
    } catch {
        return (req, res, next) =>
            next(createHttpError(500, "Can't load swagger docs"));
    }
};
;