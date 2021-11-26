const express = require("express");
const Router=  express.Router() ;
const newsLetterController=  require("../controller/newsletterController")
const auth =  require("../util/isAuth")
Router.route("/admin/send", auth.isAdminAuth , auth.isAdmin,)
.post( newsLetterController.newsLetter);
Router.get("/admin/newsLetter" ,auth.isAdminAuth , auth.isAdmin,  newsLetterController.getNewsLetterPage);

module.exports =  Router;