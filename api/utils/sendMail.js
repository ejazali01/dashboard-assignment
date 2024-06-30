import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"TestingPara.in" testp3848@gmail.email', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log(`✔️   Message sent: ${info.messageId}`);
  }

  main().catch(console.error);
  return {
    status: 200,
    success: true,
    message: `✔️   Message sent success`,
  };
};

export default sendEmail;
