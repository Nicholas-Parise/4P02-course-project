const mailgun = require("mailgun-js");
require("dotenv").config();


const mg = mailgun({
    username: "api",
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });


const sendEmail = async (to, subject, text, html = null) => {
    try {
     /*
        const data = {
        from: "Wishify Support Team <support@mail.wishify.ca>",
        to: ["Nicholas Parise <1nicholasparise@gmail.com>"],
        subject: "Hello Nicholas Parise",
        text: "Congratulations Nicholas Parise, you just sent an email with Mailgun! You are truly awesome!",
      };
  */
      const data = {
        from: "Wishify Support Team <support@mail.wishify.ca>",
        to,
        subject,
        html: html || text,
      };

      await mg.messages().send(data);

      console.log(data); // logs response data
    } catch (error) {
      console.log(error); //logs any error
    }
  };




/*
//send an email to users
 const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_APPPASSWORD
    }
  });

const sendEmail = async (to, subject, text, html = null) => {
    try {
      const mailOptions = {
        from: `"Support Team" <${process.env.EMAIL_USER}>`, // Display name & sender
        to,
        subject,
        text,
        html: html || text, // Fallback to plain text if HTML isn't provided
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  };
  */
  module.exports = sendEmail;