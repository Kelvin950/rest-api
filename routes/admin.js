const express =  require("express");

const Router =  express.Router();
const adminController=   require("../controller/adminController")
const auth =  require("../util/isAuth")
express.json()
express.urlencoded({extended:false})

Router.route("/")
.post( auth.isAuth , auth.verifyAdmin , adminController.createData)

Router.route("/:carId")
.put(auth.isAuth , auth.verifyAdmin , adminController.updateCarDet)
.delete(auth.isAuth , auth.verifyAdmin , adminController.deleteCarDet);
module.exports =  Router