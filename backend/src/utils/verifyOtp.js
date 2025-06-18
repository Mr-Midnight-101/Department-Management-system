import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const test = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  name:"CampSync",
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ransom.olson68@ethereal.email",
    pass: "FWwzh8WFMEpc82STtq",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailVerify = async ({
  userEmail,
  userName,
  otpCode,
  otpExpiry,
}) => {
  console.log(userEmail, userName, otpCode, otpExpiry);
  if (!userEmail || !userName) {
    console.log("Not available false");
    return false;
  }
  const otpExpiryIST = new Date(
    Date.now(otpExpiry) + 10 * 60 * 1000
  ).toLocaleString("en-IN", {
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
        <p>Use the following OTP to verify your email. This code is valid for 10 minutes:</p>
        <div class="otp-box">${otpCode}</div>
        <p class="info">If you didn’t request this, you can safely ignore this email.</p>
        <div class="footer">
          &copy; 2025 CampSync. All rights reserved.
        </div>
      </div>
    </body>
    </html>`;

  try {
    const result = await transporter.sendMail({
      from: `"CampSync" <ransom.olson68@ethereal.email>`,
      to: userEmail,
      subject: "Welcome to CampSync",
      text: `Your OTP is: ${otpCode}. It expires at ${otpExpiryIST}.`,
      html: htmlContent,
    });

    console.log("Email", nodemailer.getTestMessageUrl(result));
    console.log(result);

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};
