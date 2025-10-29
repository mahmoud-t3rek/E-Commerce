import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
export const SendEmail=async(malnOptional:Mail.Options)=>{

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 456,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


  const info = await transporter.sendMail({
    from: `"E-commerce" <${process.env.EMAIL}>`,
    ...malnOptional
});

  console.log("Message sent:", info.messageId);
;
}

export const  CreateOTP= async()=>{
return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
}