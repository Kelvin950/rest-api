const express =  require("express");

const Router =  express.Router();
const carController=   require("../controller/carController")
const auth =  require("../util/isAuth")
express.json()
express.urlencoded({extended:false})


Router.route("/")
.get(auth.isAuth ,carController.getCars)

Router.route("/search")
.get(auth.isAuth ,carController.getSearch)

Router.route("/:type/:value")
.get(auth.isAuth ,carController.getCarOntype)

Router.route("/:carId")
.get(auth.isAuth ,carController.getSingleCar);
module.exports  =Router;