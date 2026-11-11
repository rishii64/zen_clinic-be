const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_FROM || (SMTP_USER && !SMTP_PASS)) {
    throw new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_FROM, SMTP_USER and SMTP_PASS.');
  }

  if (!transporter) {
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('SMTP_PORT must be a valid port number.');
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      ...(SMTP_USER ? { auth: { user: SMTP_USER, pass: SMTP_PASS } } : {})
    });
  }

  return transporter;
};

exports.sendPasswordResetOtp = async (email, otp) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`
  });
};
