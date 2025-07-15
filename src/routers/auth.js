
import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  requestResetEmailValidation,
  requestResetEmailController
} from "../controllers/auth.js";

import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidation, loginUserValidation } from "../validation/authValidation.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserValidation), registerUserController);
authRouter.post('/login', validateBody(loginUserValidation), loginUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/send-reset-email', requestResetEmailValidation, requestResetEmailController);
// authRouter.post('/reset-password, ')


export default authRouter;


