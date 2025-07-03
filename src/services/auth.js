import createHttpError from "http-errors";
import { User} from '../db/models/user.Model.js';
import bcrypt from 'bcrypt';
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

 await Session.findOneAndDelete({userId: user._id});
}
