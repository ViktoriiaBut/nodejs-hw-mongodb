import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
   const user = getEnvVar('MONGODB_USER')
   const pwd = getEnvVar('MONGODB_PASSWORD');
   const url = getEnvVar('MONGODB_URL');
   const db = getEnvVar('MONGODB_DB');

   const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

   try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully!');

   } catch (error) {
    console.log('Mongo connection error:', error.message);
    throw error;
   }
};



