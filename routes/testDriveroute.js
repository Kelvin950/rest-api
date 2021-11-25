const express = require("express");
const Router =  express.Router();
const bookController =  require("../controller/TestDriveController");

const {isAuth}= require("../util/isAuth")
express.json();
express.urlencoded({extended:false});


Router.route("/testdrive")
.get(bookController.getTestDrive)

// Router.post("/testdrive/drive",isAuth,function(req,res,next){
//     console.log("aplah")
//     res.status(200)
//     res.redirect("/")
// })
Router.post("/testdrive/drive" , isAuth, bookController.postBook
);




module.exports = Router;