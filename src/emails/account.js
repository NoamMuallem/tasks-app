const sgmail = require("@sendgrid/mail");

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: "noamMuallem@testApp.com",
    subject: "Thank you for joining in",
    text: `welcome to the app, ${name}, let me know how you get along with it`
  });
};

const sendCancelationEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: "noamMuallem@testApp.com",
    subject: "goodbye",
    text: `good bye, ${name}, hoped you liked it.\ncould you please tell us why did you left?`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
