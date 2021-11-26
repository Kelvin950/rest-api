const express = require("express");
const Router =  express.Router();
const {body} =  require("express-validator");
const bookController =  require("../controller/TestDriveController");
const Car = require("../Model/Car");
const {isAuth}= require("../util/isAuth")
express.json();
express.urlencoded({extended:false});


Router.route("/testdrive")
.get( bookController.getTestDrive)

// Router.post("/testdrive/drive",isAuth,function(req,res,next){
//     console.log("aplah")
//     res.status(200)
//     res.redirect("/")
// })
Router.post("/testdrive/drive" , [
    body("name" , "Username should be alphabetical").isAlpha().notEmpty().trim() , body("phone" , "Phone number should not be empty").not().isEmpty().trim(),
    body("model" , "Should not be empty").not().isEmpty().trim(), 
    body("make" , "").custom((value , {req})=>{
        return   Car.find({$text:{$search:value}}).then(model1=>{
            console.log(model1);
              if(model1.length <=0){
               return   Promise.reject( `${value} not available at the moment`);
              }
          });
      }).trim()  
], isAuth, bookController.postBook
);




module.exports = Router;