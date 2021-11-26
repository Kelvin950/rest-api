const User = require("../Model/User")
const Book =  require("../Model/Book")
const crypto = require("crypto");
const { errorHandler } = require("../util/errorHandler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sengridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();
const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.APIKey)
const { validationResult } = require("express-validator");
const Car = require("../Model/Car")
const checkErrors = function (req, res, next, errorMessage, errorStatusCode) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors.array())
      // errorHandler(errorMessage, errorStatusCode, errors.array());
      
    }
  };
;

exports.createData = async (req, res, next) => {
  try {
    checkErrors(req, res, next, "Validation failed", 422);
    if (!req.files["image"][0] && !req.files["gallery"]) {
       
     req.flash("error","Car images are Required");
      res.redirect("")
    }

    // console.log(req.body, req.files);

    const {
      model,
      make,
      year,
      engineCapacity,
      seating,
      horsepower,
      fueltype,
      transmission,description,
      enginetype,
      price,
    } = req.body;

    console.log(req.files["gallery"])
    const headPic = req.files["image"][0].path.replace(/\\/g, "/").slice(7);
    const otherImages = req.files["gallery"].map((g) => {
      return g.path.replace(/\\/g, "/").slice(7);
    });

    const carDetails = {
      model: model,
      make: make.toUpperCase(),
      price: +price,
      year: year,
      description:description,
      headPic: headPic,
      otherImages: otherImages,
      specification: {
        engineCapacity: engineCapacity,
        transmission: transmission,
        seating: +seating,
        horsepower: horsepower,
        fueltype: fueltype,
        enginetype: enginetype,
      },
    };
    const saveCarDetails = await new Car(carDetails).save();

    res.status(200);
   
    res.json({
      message:"successful" , car:saveCarDetails
    })
  } catch (err) {
    // console.log(err)
    
         next(err)
  }
};


exports.updateCarDet = async (req ,res,next)=>{

  const {carId} =req.params ;

  try{
    // console.log("ncnc")
  if(!req.files["image"][0] && !req.files["gallery"]){

    errorHandler("no files uploaded" ,422);
  }
   
  const { updatedmodel,
    updatedmake,
    updatedyear,
    updatedengineCapacity,
    updatedseating,
    updatedhorsepower,
    updatedfueltype,
    updatedtransmission,
    updatedenginetype,
    updatedprice,
  
  }=   req.body ;

 const updatedheadPic =  req.files["image"][0].path.replace(/\\/g ,"/").slice(7);
      const updatedOtherImages =  req.files["gallery"].map(g=> g.path.replace(/\\/g, "/").slice(7));
    const car=  await Car.findById(carId)
    // console.log(car);

    if(!car){
      errorHandler("Car does not exist" , 404);

    }
    // console.log(car);
    
   
    const newCar =  {
      model: updatedmodel,
      make: updatedmake,
      price: +updatedprice,
      year: updatedyear,
      headPic: updatedheadPic,
      otherImages: updatedOtherImages,
      specification: {
        engineCapacity: updatedengineCapacity,
        transmission: updatedtransmission,
        seating: +updatedseating,
        horsepower: updatedhorsepower,
        fueltype: updatedfueltype,
        enginetype: updatedenginetype,
      },
    }
    const updatedCarDet =  await Car.updateOne({_id:car._id} , {$set:newCar} , {new:true})
   if(!updatedCarDet){
     errorHandler("failed" , 500)
   }
   deleteImage(car.headPic);

    car.otherImages.forEach(image=> deleteImage(image));
    res.status(200);
    res.json({
      message:"succeeded" , 
      carDetails :updatedCarDet
    })


  }catch(err){

    if(!err.statusCode){
       err.statusCode = 500 ;
       next(err);
    }
  }



}


exports.deleteCarDet = async (req ,res,next)=>{

const  {carId}  = req.params ; 
    
try{

  const car =  await Car.findById(carId);
  if(!car){

    req.flash("error" ,"Car not found");
    res.redirect("")
  }

  const headpic=  car.headPic ;
  const otherImages =  car.otherImages ;

  await Car.findByIdAndRemove(carId);
  deleteImage(car.headPic);
  otherImages.forEach(images=> deleteImage(images))

   res.statusCode=  200;
   res.redirect("")
}catch(err){
   
  return res.statusCode=404;

  }
}
exports.getAdminLogin =  (req,res,next)=>{
  let error= req.flash("error");
  if(error.length > 0){
 
       error=error[0]
  }else{
      
      error=null
  }
  res.render("admin/login" ,{
    title:"Admin Login",
    error:error
  })

}

exports.getAdminPanel =  (req ,res, next)=>{
  res.render("admin/adminPanel" ,{
    title:"Admin Panel",
    
  })
}
exports.adminlogin = async (req, res, next) => {
  try {

    checkErrors(req, res, next, "Validation failed", 422);
    const email = req.body.email;
    const password = req.body.password;
   


    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error" ,"Incorrect password or email" )
   
 return   res.redirect("/admin");
    }
    if(!user.admin){
      req.flash("error" ,"You are unauthorized")
   
     return res.redirect("/admin");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      req.flash("error" ,"Incorrect password or email")
   
     return res.redirect("/admin");
    }
   
    // console.log(req.useragent);
    // console.log(req.ip);
   
    // const logInInfo  = await transporter.sendMail({
    //     to:email,
    //     from:process.env.myemail,
    //     subject:"You just logged in",
    //     html:`<h1>You just logged in </h1><p>IpAddress:${req.ip}</p><p>Browser:${req.useragent.browser}</p>
    //     <a href="http://localhost:8080/page/page1?q=2">Link</a>`
    // })
    // const token = jwt.sign(
    //   { email: user.email, id: user._id.toString() , admin:user.admin },
    //   process.env.secret,
    //   { expiresIn: "1h" }
    // );
     
  
   
    // res.status(200).json({
    //   message: "Logged in",
    //   token: token,
    //   email: user.email,
    //   name: user.name,
    //   admin: user.admin,
    // });
    req.session.isLoggedIn = true;
    req.session.user = user;
 
    res.redirect("/admin/adminPanel");
  } catch (err) {
    // if (!err.statusCode) {
    //   err.statusCode = 500;
    // }
    // next(err);
    // console.log(err)
    let error=err.data.map(data=>data.msg).join('\n')
    req.flash("error" ,error )
    // console.log(error);
    res.redirect("/admin");
  }
}



exports.getBookPage =async  (req ,res,next)=>{
 
try{

 let books  =   await Book.find({});
//  console.log(books)
 
  // newBooks =  books.map(book=> JSON.stringify(book.books));
  //     newBooks =JSON.parse(newBooks)
      // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      
      // newBooks =  newBooks.map(book=>{
      //   return{
          
      //     _id:book._id ,
      //     name:book.name ,
      //     model:book.model ,
      //     make:book.make ,
      //     date:3,
      //     time:book.time
      //   }
      // })
      // console.log(newBooks);


         if(books.length<=0){
             
        return  res.render("admin/bookings" , { title:"Bookings",
            books:[] , message:null , error:null
          })

         }
         const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
         books=books.map(book=>{
          return book.books.map(book1=>{
            return{
              parent_id:book._id,
              _id:book1._id ,
              name:book1.name ,
              model:book1.model ,
              make:book1.make ,
              date:new Date(book1.date).toLocaleDateString(undefined, options),
              time:book1.time
            }
          })
        }).flat();
        
        // console.log(books);
        //  books = books.map(book=>{
        //    return {
        //      name:book.user.name , 
        //      book:book
        //    }
        //  })

        let message=  req.flash("message");
        let error= req.flash("error");
      if(message.length > 0 && error.length <= 0){
          message=message[0]
           error=null
      }else{
          message=null;
          error=error[0]
      }

         res.render("admin/bookings" , {
         title:"Bookings",  books:books , message:message ,error:error
         });

}catch(err){
       console.log(err)
  res.statusCode = 404

}


}


exports.acceptBookings=  async (req ,res,next)=>{
  
  try{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const bookId = req.params.bookId ;
    const specificId =  req.params.specificId
   const book =  await Book.findById(bookId).populate("user");
// console.log(book)
   if(!book){
       
    req.flash("error" , "specific booking does not exist");
   return res.redirect("/admin/bookings")
   }
   console.log(book.user.email)
    const specificBook =  book.books.find(book=>book._id ===specificId )
   const msg = {
    to: book.user.email, // Change to your recipient
    from: "twofriends082@gmail.com", // Change to your verified sender
   
   templateId:"d-c8237dac574f4dbfa075e3bac3dee369",
   dynamicTemplateData:{
    subject:`Sorry. Your appointment with has beeen accepted`,
       name:"Some one" ,
       city:"Denver"
   }
  }
 await  sgMail.send(msg)
   
   book.books.id(specificId).remove()
   await book.save()
   
       req.flash("message" ,"Email sent successfully")
   res.redirect("/admin/bookings")

  }catch(err){

    console.log(err)
    res.statusCode = 404
    req.flash("error" ,"Internal Server error")
    res.redirect("/admin/bookings")
  }
  

}

exports.declineBookings=  async (req ,res,next)=>{
  
  try{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const bookId = req.params.bookId ;
    const specificId =  req.params.specificId
   const book =  await Book.findById(bookId).populate("user");

   if(!book){
       
    req.flash("error" , "specific booking does not exist");
   return res.redirect("/admin/bookings")
   }
  //  console.log(book.books);
    const specificBook =  book.books.find(book=>book._id ===specificId );
       
   const msg = {
    to: book.user.email, // Change to your recipient
    from: "twofriends082@gmail.com", // Change to your verified sender
   
   templateId:"d-c8237dac574f4dbfa075e3bac3dee369",
   dynamicTemplateData:{
       subject:`Sorry. Your appointment has beeen declined`,
       name:"Some one" ,
       city:"Denver"
   }
  }
 await  sgMail.send(msg)
   
   book.books.id(specificId).remove()
   await book.save()
   
       req.flash("message" ,"Email sent successfully")
   res.redirect("/admin/bookings")

  }catch(err){

    console.log(err)
    res.statusCode = 404
    req.flash("error" ,"Internal Server error")
    res.redirect("/admin/bookings")
  }
  

}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // console.log(err);
    res.redirect('/admin');
  });
};