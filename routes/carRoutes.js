const express =  require("express");

const Router =  express.Router();
const carController=   require("../controller/carController")
const auth =  require("../util/isAuth")
// Router.use(express.json())
// Router.use(express.urlencoded({extended:false}))

Router.route("/")
.get(auth.isAuth ,carController.getCars)

Router.route("/search")
.get(carController.getSearch)

Router.route("/brand/:make")
.get(carController.getCarOnMake);



// Router.route("/:type/:value")
// .get(auth.isAuth ,carController.getCarOntype)

Router.route("/car/:carId")
.get(carController.getSingleCar);

 module.exports  =Router;