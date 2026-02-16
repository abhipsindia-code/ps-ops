const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTPEmail = async ({ toEmail, userEmail, otp }) => {
  await transporter.sendMail({
    from: `"PS Ops" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Signup OTP",
    text: `OTP for ${userEmail}: ${otp}`,
  });
};

module.exports = { sendOTPEmail };
