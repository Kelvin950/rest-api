const express   =require("express");
const Router=  express.Router();
const services =  require("../service/render")

Router.route("/")
.get(services.home);

Router.get("/about" , services.aboutus);
Router.get("/contact" , services.ContactUs);
module.exports = Router;