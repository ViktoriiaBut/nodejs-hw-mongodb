
import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController
} from "../controllers/auth.js";

import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidation, loginUserValidation } from "../validation/authValidation.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserValidation), registerUserController);
authRouter.post('/login', validateBody(loginUserValidation), loginUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post('/logout', logoutUserController);

export default authRouter;


