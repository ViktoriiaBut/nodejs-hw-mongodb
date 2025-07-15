import { registerUser, loginUser, logoutUser, refreshSession, requestResetEmail } from "../services/auth.js";
import mongoose from "mongoose";

const setUpSessionCookies = (session, res) => {
  const sessionId = session._id instanceof mongoose.Types.ObjectId
    ? session._id.toHexString()
    : session._id;

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
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


export const logoutUserController = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;

    if (!refreshToken || !sessionId) {
      return res.status(400).json({ status: 400, message: 'Missing session cookies' });
    }

    await logoutUser(sessionId, refreshToken);

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


export const refreshSessionController = async (req, res, next) => {
  try {

    const { refreshToken } = req.cookies;
    const session = await refreshSession(refreshToken);

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

export const requestResetEmailController = async (req, res,) => {
   const {email} = req.body;

   await requestResetEmail {email};

   res.send({
    status: 200,
    message: 'Reset password email has been successfully sent',
    data: {},
   });
};
