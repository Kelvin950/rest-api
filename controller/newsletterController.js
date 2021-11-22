// const Users=  require("../Model/User");
const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.APIKey)
    const sengridTransport = require("nodemailer-sendgrid-transport");
    const nodemailer = require("nodemailer");
exports.newsLetter = (req , res, next)=>{
    
    const msg = {
      to: 'kelvinbaiden32@outlook.com', // Change to your recipient
      from: "twofriends082@gmail.com", // Change to your verified sender
     
     templateId:"d-c8237dac574f4dbfa075e3bac3dee369",
     dynamicTemplateData:{
         subject:"Testing template",
         name:"Some one" ,
         city:"Denver"
     }
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        res.json({message:"succeeded"})
      })
      .catch((error) => {
        console.log(error.response.body)
        next(error)
      })
};

