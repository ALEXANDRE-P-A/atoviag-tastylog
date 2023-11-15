/*
  Referenct: https://nodemailer.com/
*/

const nodemailer = require("nodemailer");
require("dotenv").config();

const main = targetEmail =>{
  const message = {
    from: process.env.EMAIL_GOOGLE_ACCOUNT,
    to: targetEmail,
    subject: "Nodejs Registration mailer test",
    text: `Registration completed with email ${targetEmail}.\n\nPlease use this email as username to login.\n\nAtoviag Tastylog` 
  };

  const smtpConfig = {
    host: process.env.EMAIL_HOST_GOOGLE,
    port: process.env.EMAIL_PORT_GOOGLE,
    secure: true, // gmail: true, iCloud: false
    auth: {
      user: process.env.EMAIL_GOOGLE_ACCOUNT,
      pass: process.env.EMAIL_APP_PASS_GOOGLE
    }
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.sendMail(message, function(err, response){
    console.log(err || response);
  });
};

module.exports = { main };