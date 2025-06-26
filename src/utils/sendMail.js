const nodemailer = require("nodemailer");
const sendEmail = async (mailOptions) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    }
  });

  const info = await transporter.sendMail({
    from: `"Salon Saç" <${process.env.GMAIL_USER}>`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });

  return info;
};

module.exports = sendEmail;
