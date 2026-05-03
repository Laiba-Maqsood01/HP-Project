import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer"
import config from "../config/config.js"

// const transporter = nodemailer.createTransport({
//    service:"gmail",
//    auth:{
//     user: config.GOOGLE_USER, //Gmail address
//     pass: config.GOOGLE_APP_PASSWORD
//    }
// })
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.GOOGLE_USER,
    pass: config.GOOGLE_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `<${config.GOOGLE_USER}>`, 
      to, 
      subject, 
      text, 
      html, 
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
