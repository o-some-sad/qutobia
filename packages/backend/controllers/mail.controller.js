import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASS,
  },
});

function sendMail(to, sub, msg) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
  console.log("verification email sent !");
}

export { sendMail };
