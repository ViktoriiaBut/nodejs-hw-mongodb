import { registerUser, loginUser } from "../services/auth.js";

export const registerUserController = async( req, res) => {
    const user = await registerUser(req.body);

    res.json({
        status: 200,
        message: "Successfully created User",
        data: user,
    });
};

export const loginUserController = async( req, res) => {
    const user = await loginUser(req.body);

    res.json({
        status: 200,
        message: "Successfully logged User",
        data: user,
    });
};
