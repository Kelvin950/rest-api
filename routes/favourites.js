const express =  require("express");
const Router =  express.Router();
const carController=   require("../controller/carController")
const {isAuth} =  require("../util/isAuth")
express.json()
express.urlencoded({extended:false})

Router.get("/favorite" ,isAuth, carController.getFav);
Router.post("/car/addfavorite/:carId" ,isAuth, carController.addFavourites);
Router.post("/deletefavorite/:carId" , isAuth , carController.deleteFav);


module.exports=  Router;