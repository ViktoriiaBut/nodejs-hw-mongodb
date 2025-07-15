import { createTransport } from "nodemailer"
import { getEnvVar } from "./getEnvVar";
import createHttpError from "http-errors";

const mailClient = createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: getEnvVar('SMTP_PORT'),
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASS'),
    }
});

export const sendEmail = async ({ email }) => {
  try {
   await mailClient.sendMail({
    to: email,
    subject: 'Reset your password',
    html: '<h1>Here is your reset password email!</h1>',
   });
  } catch(error) {
    console.error(error);
    throw createHttpError(500, 'Failed to send email');
  }

};
