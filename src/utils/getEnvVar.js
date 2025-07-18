import dotenv from 'dotenv';

dotenv.config();

// export const getEnvVar = (name, defaultValue) => {
//   const envVar = process.env[name];

//   if(envVar) return envVar;
//   if(!envVar && defaultValue) return defaultValue;

//   throw new Error(`Missing: process.env['${name}']`);
// }

export const getEnvVar = (key) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Missing ENV: ${key}`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
