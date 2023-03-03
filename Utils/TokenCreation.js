// const sgMail = require("@sendgrid/mail");
// const db = require("../config/Connection");
// const { Template } = require("./DynamicTemplate");
// exports.SignUpEmail = async (recipient) => {
//   sgMail.setApiKey(
//     "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"
//   );
//   const emaildetail = await db.EmailTemplateModel.findOne({
//     where: {
//       TemplateName: "SignUp",
//     },
//   });
//   const msg = {
//     to: recipient, // recipient email address
//     from: process.env.SMPT_MAIL, // sender email address
//     subject: emaildetail.Subject,
//     text: "This is the plain text content",
//     html: Template(emaildetail.Html),
//   };

//   // Send the email
//   sgMail
//     .send(msg)
//     .then(() => console.log("Email sent successfully"))
//     .catch((error) => console.error(error));
// };
const TokenCreation = (user, statusCode, res) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  SignUpEmail(data.Email);
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = TokenCreation;
//time , gmt , ip ,
