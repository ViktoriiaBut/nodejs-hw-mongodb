import { createTransport } from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const mailClient = createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASS'),
  }
});

export const sendEmail = async ({ email, html, subject }) => {
  try {
    await mailClient.sendMail({
      to: email,
      subject,
      html,
      from: getEnvVar('SMTP_FROM'),
    });
  } catch (error) {
    console.error('Email send failed:', error);
    throw createHttpError(500, 'Failed to send email');
  }
};
