"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMagicLink = void 0;
const nodemailer_1 = require("nodemailer");
const config_1 = __importDefault(require("dotenv/config"));
console.log(config_1.default);
const transporter = (0, nodemailer_1.createTransport)({
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
        }
        else {
            resolve(success);
        }
    });
});
const sendMagicLink = async (email, link, message) => await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail({
        to: email,
        subject: "Verify your email address for Arkea",
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
              <img class="logo" src="https://res.cloudinary.com/dbkivxzek/image/upload/v1678213526/ARkea/sd5xw9pk1t4nfwloq3xo.svg" alt="Your Logo">
            
                <h2 style="color: #ff7742;">ARkea Email Confirmation</h2>
            
                <p>Dear User,</p>
            
                <p>Thank you for signing up for ARkea! Before we can fully activate your account, we need to verify your email address. Please click the following link within the next hour to confirm your email address and complete the registration process:</p>
            
                <p><a class="button" style='color:white' href="http://10.0.2.2:4002/${link}">Click here to verify your email address</a></p>
            
                <p>If you are unable to click the link, please copy and paste it into your browser's address bar.</p>
            
                <p>Please note that this link will expire in one hour, so please verify your email address as soon as possible.</p>
            
                <p>If you did not sign up for ARkea, please disregard this email.</p>
            
                <p>Thank you for choosing ARkea! We look forward to serving you.</p>
            
                <p>Best regards,<br>ARkea team</p>
              </div>
            </body>
            </html>
            
                        `,
    }, (err, info) => {
        if (err) {
            console.error(err);
            reject(err);
        }
        else {
            console.log(info);
            resolve(info);
        }
    });
});
exports.sendMagicLink = sendMagicLink;
