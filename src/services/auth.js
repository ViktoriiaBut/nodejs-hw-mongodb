import createHttpError from "http-errors";
import { User} from '../db/models/user.Model.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { Session } from "../db/models/sessionModel.js";

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
