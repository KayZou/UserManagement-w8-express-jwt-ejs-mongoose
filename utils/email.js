require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define the email options
  const mailOptions = {
    from: "ziko elghe",
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html:
  };
  // send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
