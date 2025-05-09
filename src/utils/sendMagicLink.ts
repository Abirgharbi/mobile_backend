import { createTransport } from 'nodemailer';
import dotenv from 'dotenv/config';

console.log(dotenv);


const transporter = createTransport({
  service: 'gmail',
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});


new Promise((resolve, reject) => {
  transporter.verify(function (error, success) {
    if (error) {
      reject(error);
    } else {
      resolve(success);
    }
  });
});

export const sendMagicLink = async (email: string, link: string, message: string) => await new Promise((resolve, reject) => {
  // send mail
  transporter.sendMail(
    {
      to: email,
      subject: "Verify your email address for KOA Home",
  
      html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                /* Add your custom CSS styles here */
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.5;
                  color: #333333;
                }
            
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #dddddd;
                  border-radius: 5px;
                  background-color: #f9f9f9;
                }
            
                h2 {
                  font-size: 24px;
                  margin-bottom: 20px;
                  color: #ff7742;
                }
            
                p {
                  margin-bottom: 10px;
                }
            
                .logo {
                  display: block;
                  margin-bottom: 20px;
                }
            
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #ff7742;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                }
            
                .button:hover {
                  background-color: #e65f25;
                }
              </style>
            </head>
            <body>
              <div class="container">
              <img class="logo" src="https://drive.google.com/uc?export=view&id=19k1oLdIqlx52SmKoer3kVLjVzXGVGigf" alt="Your Logo">

            
                <h2 style="color: #ff7742;">KOAHome Email Confirmation</h2>
            
                <p>Dear User,</p>
            
                <p>Thank you for signing up for KOAHome! Before we can fully activate your account, we need to verify your email address. Please click the following link within the next hour to confirm your email address and complete the registration process:</p>
            
                                                <p><a class="button" style='color:white' href="http://KOA/verify${link}">Click here to verify your account  </a></p>

            
                <p>If you are unable to click the link, please copy and paste it into your browser's address bar.</p>
            
                <p>Please note that this link will expire in one hour, so please verify your email address as soon as possible.</p>
            
                <p>If you did not sign up for KOAHome, please disregard this email.</p>
            
                <p>Thank you for choosing KOAHome! We look forward to serving you.</p>
            
                <p>Best regards,<br>KOAHome team</p>
              </div>
            </body>
            </html>
            
                        `,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    }
  );
});