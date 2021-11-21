const express =  require("express");

const Router =  express.Router();
const carController=   require("../controller/carController")
express.json()
express.urlencoded({extended:false})


Router.route("/")
.get(carController.getCars)

Router.route("/search")
.get(carController.getSearch)

Router.route("/:type/:value")
.get(carController.getCarOntype)
module.exports  =Router;