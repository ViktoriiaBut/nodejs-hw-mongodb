import { Router } from "express";
import { registerUserController, loginUserController} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidation, loginUserValidation } from "../validation/authValidation.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserValidation), registerUserController);
authRouter.post('/login', validateBody(loginUserValidation), loginUserController);
// authRouter.post('/refresh');
// authRouter.post('/logout');

export default authRouter;


