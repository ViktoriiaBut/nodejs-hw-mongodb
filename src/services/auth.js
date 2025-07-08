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


export const logoutUser = async(sessionId, sessionToken) => {
    await Session.findOneAndDelete({_id: sessionId, refreshToken: sessionToken});
    }


export const refreshSession = async(sessionId, sessionToken) => {
    const session = await Session.findOne({_id: sessionId, refreshToken: sessionToken});

    if(!session) {
        throw createHttpError(401, 'Session not found');
    }
    if(session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Session expired');
    }

    await Session.findOneAndDelete({ _id: sessionId });

   const newSession = await Session.create({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    userId: session.userId,
 });
 return newSession;
}


