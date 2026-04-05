import nodemailer from "nodemailer";

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"DevFlow" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
