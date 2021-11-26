const User=  require("../Model/User");
require("dotenv").config()
const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.APIKey)
    // const sengridTransport = require("nodemailer-sendgrid-transport");
    // const nodemailer = require("nodemailer");


    exports.getNewsLetterPage = (req ,res,next)=>{
      let message=  req.flash("message");
      let error= req.flash("error");
    if(message.length > 0 && error.length <= 0){
        message=message[0]
         error=null
    }else{
        message=null;
        error=error[0]
    }
      res.render("admin/news" ,{ message:message ,error:error , 
        title:"News Letter"
      });
    }
exports.newsLetter = async (req , res, next)=>{
    
  try{
    const templateId =  req.body.template_id
 const allSubscribedUsers = await User.find({subscription:true});
  //  console.log( allSubscribedUsers)
 if(!allSubscribedUsers){
    
  req.flash("error", "Internal Server Error 500");
 return  res.redirect("/admin/newsLetter")

 }

 allSubscribedUsers.forEach( async (user)=>{
  const msg = {
    to: user.email, // Change to your recipient
    from: "twofriends082@gmail.com", // Change to your verified sender
   
   templateId:templateId,
   dynamicTemplateData:{
       subject:"Testing template",
       name:"Some one" ,
       city:"Denver"
   }
  }
  await  sgMail.send(msg)
 
   
       req.flash("message" ,"News Letter Sent Successfully")
   res.redirect("/admin/newsLetter")
})} catch(err){
    // console.log(err);
    res.statusCode = 404;
  }

 }


//     const msg = {
//       to: 'kelvinbaiden32@outlook.com', // Change to your recipient
//       from: "twofriends082@gmail.com", // Change to your verified sender
     
//      templateId:"d-c8237dac574f4dbfa075e3bac3dee369",
//      dynamicTemplateData:{
//          subject:"Testing template",
//          name:"Some one" ,
//          city:"Denver"
//      }
//     }
//     sgMail
//       .send(msg)
//       .then(() => {
//         console.log('Email sent')
//         res.json({message:"succeeded"})
//       })
//       .catch((error) => {
//         console.log(error.response.body)
//         next(error)
//       })
//   }catch(err){

//   }
  
// };

