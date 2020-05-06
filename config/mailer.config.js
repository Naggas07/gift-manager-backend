const nodemailer = require("nodemailer");

const APP_HOST = process.env.APP_HOST || "http://localhost:5000";

const user = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, password },
});

//types of emails

module.exports.sendValidateEmail = (sendUser) => {
  transporter.sendMail({
    from: `Gift Manager 🎁 ${user}`,
    to: sendUser.email,
    subject: `Bienvenido a Gift-Manager!`,
    html: `
        <h1>Welcome</h1>
        <a href='${APP_HOST}/users/${sendUser.token}/validate'>Confirm account</a>
    `,
  });
};
