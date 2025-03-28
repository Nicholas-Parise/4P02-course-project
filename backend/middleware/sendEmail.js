const mailgun = require("mailgun-js");
require("dotenv").config();

const mg = mailgun({
  username: "api",
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const sendEmail = async (to, subject, text, html = null) => {

  const data = {
    from: "Wishify Support Team <support@mail.wishify.ca>",
    to,
    subject,
    html: html || text,
  };

  console.log(data);
  await mg.messages().send(data);

  // if it doesn't send it will throw error
  /*
  console.log(data); // logs response data
} catch (error) {
  console.log(error); //logs any error
}
  */
};
module.exports = sendEmail;