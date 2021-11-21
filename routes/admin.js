const express =  require("express");

const Router =  express.Router();
const adminController=   require("../controller/adminController")
express.json()
express.urlencoded({extended:false})

Router.route("/")
.post(adminController.createData)

module.exports =  Router