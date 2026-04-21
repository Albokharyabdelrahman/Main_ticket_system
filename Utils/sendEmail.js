const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bookedinservices@gmail.com',
    pass: 'mzohtjooqoxzsumd'
  },
});

async function sendVerificationEmail(to, subject, html, attachments = []) {
  const mailOptions = {
    from: 'bookedinservices@gmail.com',
    to,
    subject,
    html,
    attachments
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
  transporter
};
