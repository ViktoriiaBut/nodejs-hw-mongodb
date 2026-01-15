import createHttpError from "http-errors";
import { User} from '../db/models/user.Model.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { Session } from "../db/models/sessionModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import { getEnvVar } from "../utils/getEnvVar.js";
import handleBars from 'handlebars';
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_DIR } from "../constants/paths.js";
import { ENV_VARS } from "../constants/envVars.js";
// import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';


const resetPasswordTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'reset-password-email.html'),)
.toString();

export const requestResetEmail = async ({ email }) => {
  const user = await User.findOne({ email });

  if(!user) {
   throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign({
   sub: user._id,
   email,
  }, getEnvVar('JWT_SECRET'), {
   expiresIn: '15m',
  }, );

  const template = handleBars.compile(resetPasswordTemplate);

  const html = template({
   name: user.name,
   link: `${getEnvVar(ENV_VARS.FRONTEND_DOMAIN)}/reset-password?token=${token}`,
  })

  await sendEmail({ email, html, subject:'Reset your password!' });
};


export const resetPassword = async (payload) => {
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch(error) {
   console.log(error);
   throw createHttpError(401, 'JWT token expired')
  }

  const user = await User.findOne({
        email: tokenPayload .email,
        _id: tokenPayload .sub
    });

   if(!user) {
    throw createHttpError(404, 'User not found')
   }

   const hashedPassword = await bcrypt.hash(payload.password, 10);

     await User.updateOne({
        _id: user._id,
    },
        {
            password: hashedPassword
        });
};

export const registerUser = async (payload) => {
 const existingUser = await User.findOne({email: payload.email});

 if(existingUser) {
    throw createHttpError(409, "User already created");
 }

 const hashedPassword = await bcrypt.hash(payload.password, 10);
 const user = await User.create({
    ...payload,
    password: hashedPassword});

 return user;
}

export const loginUser = async (payload) => {
 const user = await User.findOne({email: payload.email});

 if(!user) {
    throw createHttpError(401, 'User not found');
 }
 const isEqual = await bcrypt.compare(payload.password, user.password);
 if(!isEqual) {
    throw createHttpError(401, 'User not found');
 }

 await Session.findOneAndDelete({ userId: user._id });

 const session = await Session.create({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    userId: user._id,
    });
 return session;
}

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await Session.create({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: session.userId,
  });

  return {
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    sessionId: newSession._id,
    accessTokenValidUntil: newSession.accessTokenValidUntil,
    refreshTokenValidUntil: newSession.refreshTokenValidUntil,
  };
};

export const logoutUser = async (refreshToken) => {
    await Session.deleteOne({ refreshToken });
};

// export const loginOrSignupWithGoogle = async (code) => {
//   const loginTicket = await validateCode(code);
//   const payload = loginTicket.getPayload();
//   if (!payload) throw createHttpError(401);

//   let user = await User.findOne({ email: payload.email });
//   if (!user) {
//     const password = await bcrypt.hash(crypto.randomBytes(10), 10);
//     user = await User.create({
//       email: payload.email,
//       name: getFullNameFromGoogleTokenPayload(payload),
//       password,
//       role: 'parent',
//     });
//   }

//   const newSession = createSession();

//   return await Session.create({
//     userId: user._id,
//     ...newSession,
//   });
// };



