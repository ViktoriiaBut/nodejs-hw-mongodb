
import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRouter from "./auth.js";
import { errorHandler } from './middlewares/errorHandler.js';

const router = Router();
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use(errorHandler);

export default router;



