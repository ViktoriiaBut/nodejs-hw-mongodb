import { registerUser, loginUser, logoutUser, refreshSession } from "../services/auth.js";

const setUpSessionCookies = (session, res) => {
 res.cookie('sessionId', session.id,
        {httpOnly: true,
         expires: session.refreshTokenValidUntil,
        });
 res.cookie('refreshToken', session.refreshToken,
        {httpOnly: true,
         expires: session.refreshTokenValidUntil,
        });
};

export const registerUserController = async( req, res) => {
    const user = await registerUser(req.body);

    res.json({
        status: 201,
        message: "Successfully created User",
    data: user,
});
};

 export const loginUserController = async( req, res) => {
    const session = await loginUser(req.body);

     setUpSessionCookies(session, res);
     res.json({
        status: 200,
         message: "Successfully logged User",
         data: {
             accessToken: session.accessToken
     },
     });
 };

export const logoutUserController = async( req, res) => {
    const {refreshToken, sessionId} = req.cookies;

    await logoutUser(sessionId, refreshToken);

    res.clearCookie(refreshToken);
    res.clearCookie('sessionId');
    res.status(204).send();
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const { sessionToken, sessionId } = req.cookies;
    const session = await refreshSession(sessionId, sessionToken);

    setUpSessionCookies(session, res);

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};
