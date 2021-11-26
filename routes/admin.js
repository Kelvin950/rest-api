const express =  require("express");
const {body} =  require("express-validator");
const User =  require("../Model/User");
const Router =  express.Router();
const adminController=   require("../controller/adminController")
const auth =  require("../util/isAuth")
Router.use(express.json());
Router.use(express.urlencoded({extended:false}))
Router.route("/admin/createData" ,auth.isAuth , auth.isAdmin)
.post(adminController.createData)

Router.get("/admin",  adminController.getAdminLogin );

Router.post("/admin/login", [
    body("email" ,"Incorrect email or password").isEmail().trim() , body("password" , "Incorrect email or password").isLength({min:8 , max:16})
], adminController.adminlogin)
Router.get("/admin/adminPanel" ,auth.isAdminAuth , auth.isAdmin,adminController.getAdminPanel );
Router.get("/admin/bookings" ,auth.isAdminAuth , auth.isAdmin, adminController.getBookPage);
Router.post("/admin/acceptBookings/:bookId/:specificId" ,auth.isAdminAuth, auth.isAdmin, adminController.acceptBookings);
Router.post("/admin/declineBookings/:bookId/:specificId" ,auth.isAdminAuth , auth.isAdmin, adminController.declineBookings);
Router.get("/admin/logout" , adminController.postLogout);
// Router.route("/:carId")
// .put(auth.isAuth , auth.verifyAdmin , adminController.updateCarDet)
// .delete(auth.isAuth , auth.verifyAdmin , adminController.deleteCarDet);
module.exports =  Router