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
import { TEMPLATE_DIR } from "../constans/paths.js";
import { ENV_VARS } from "../constans/envVars.js";


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


export const resetPassword = async ({token, password}) => {
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch(error) {
   console.log(error);
   throw createHttpError(401, 'JWT token expired')
  }

  const user = await User.findById(tokenPayload.sub);

   if(!user) {
    throw createHttpError(404, 'User not found')
   }

   const hashedPassword = await bcrypt.hash(password, 10);
     user.password = hashedPassword;
     await user.save();
     await Session.deleteMany({ userId: user._id });
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


