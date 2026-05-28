// import nodemailer from "nodemailer"
// import config from "../config/config.js"

// const transporter = nodemailer.createTransport({
//    service:"gmail",
//    auth:{
//     user: config.GOOGLE_USER, //Gmail address
//     pass: config.GOOGLE_APP_PASSWORD
//    }
// })

// // Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });


// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `<${config.GOOGLE_USER}>`, 
//       to, 
//       subject, 
//       text, 
//       html, 
//     });

//     console.log('Message sent: %s', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };


import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

// Function to send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Sandbox sender
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};