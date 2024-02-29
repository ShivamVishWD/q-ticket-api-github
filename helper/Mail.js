
const nodemailer = require("nodemailer");

// Creates a transport that sends messages to Gmail. We do this by setting the transport's flags to allow HTTPS
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "noreply@Quadrafort.com",
      pass: "Nan63206",
    },

    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_POST,
    // secure: process.env.EMAIL_SECURE,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },


  });

async function sendEmail( userMail, subject, text, html) {
  try {
        let mailOptions = {
          from: "noreply@Quadrafort.com",
          to: userMail,
          subject: subject,
          text: text,
          html: html
        };
      
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userMail}: ${info.messageId}`);

      } catch (error) {
        console.error(`Error sending email to ${userMail}:`, error);
      }
}

  function sendEmailWithAttachment( userMail, subject, text, html, attachmentName) {
    
    let mailOptions = {
      from: "noreply@Quadrafort.com",
      to: userMail,
      subject: subject,
      text: text,
      html: html,
      attachments: [
        { 
            filename: attachmentName+'.pdf',
            path: './public/websitepdf/'+attachmentName
        }
    ]
    };
  
    /**
     * @param error
     * @param info
     */
    transporter.sendMail(mailOptions, function (error, info) {
      // Send the email to the server.
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  

  module.exports = {sendEmail,sendEmailWithAttachment};