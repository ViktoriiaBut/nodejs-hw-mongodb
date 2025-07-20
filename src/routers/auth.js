
import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleUrlController
} from "../controllers/auth.js";

import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidation, loginUserValidation, requestResetEmailValidation, resetPasswordValidation } from "../validation/authValidation.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserValidation), registerUserController);
authRouter.post('/login', validateBody(loginUserValidation), loginUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/send-reset-email', validateBody(requestResetEmailValidation), requestResetEmailController);
authRouter.post('/get-google-link', getGoogleUrlController );
authRouter.post('/reset-pwd', validateBody(resetPasswordValidation), resetPasswordController);
// authRouter.post('/authorize-with-google');

export default authRouter;


