import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  name: `${process.env.SMTP_name}`,
  host: process.env.SMTP_Server,
  port: 587,
  auth: {
    user: `${process.env.Login_brevo}`,
    pass: `${process.env.brevo_pass}`,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmailVerificationCode = async ({
  userEmail,
  userName,
  verificationCode,
  codeExpireAt,
}) => {
  if (!userEmail || !userName) {
    return false;
  }

  const codeExpireAtIST = new Date(codeExpireAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  });

  const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your OTP Code</title>
      <style>
        body {
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
          text-align: center;
        }
        .header h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .otp-box {
          display: inline-block;
          padding: 16px 32px;
          font-size: 24px;
          letter-spacing: 4px;
          background-color: #007BFF;
          color: white;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .info {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .footer {
          font-size: 12px;
          color: #aaa;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>One-Time Password (OTP)</h2>
        </div>
        <p>Hello ${userName},</p>
        <p>Use the following OTP to verify your email. This code is valid for 10 minutes ${codeExpireAtIST} :</p>
        <div class="otp-box">${verificationCode}</div>
        <p class="info">If you didn’t request this, you can safely ignore this email.</p>
        <div class="footer">
          &copy; 2025 CampSync. All rights reserved.
        </div>
      </div>
    </body>
    </html>`;

  try {
    const result = await transporter.sendMail({
      from: `"CampSync" <${process.env.sender}>`,
      to: userEmail,
      subject: "Welcome to CampSync",
      text: `Your OTP is: ${verificationCode}. It expires at ${codeExpireAtIST}.`,
      html: htmlContent,
    });
    if (result.response.includes("OK")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
