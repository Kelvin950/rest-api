const express =  require("express");
const {body} =  require("express-validator");
const User =  require("../model/User");
const authController =  require("../controller/authController");
const router =  express.Router();
const passport =  require("passport")

router.use(express.json());


router.route("/signup")
.post(
 
    [
        body("name" , "name should be alphabetical").isAlpha().not().isEmpty() ,
        body("email" , "Email is incorrect").isEmail().custom((value , {req})=>{
          return  User.findOne({email:value}).then(user=>{
              console.log(user);
                if(user){
                 return   Promise.reject("Email already exists");
                }
            });
        }).normalizeEmail(),

        body("password" , "Password should be eight to 16 characters long and alphanumeric").trim().isLength({min:8 , max:16}).isAlphanumeric(),
        body("confirmPassword" ,"Password should be eight to 16 characters long and alphanumeric").trim().isLength({min:8 , max:16}).isAlphanumeric().custom((value , {req})=>{
               if(value !== req.body.password){
                   return Promise.reject("Passwords do not match");
               }
               return true;
        })
    ],
    authController.signUp


)


router.route("/login" )
.post(
[
        body("email" ,"Incorrect email").isEmail().trim() , body("password" , "Password should be eight to 16 characters long and alphanumeric").isAlphanumeric().isLength({min:8 , max:16})
    ],
    authController.login
);


router.route("/requestPasswordReset")
.post(authController.requestPasswordReset);
router.route("/resetPassword")
.put(authController.resetPassword);

router.get('/auth/facebook/token', passport.authenticate('facebook-token') , authController.fbauth)


module.exports  =  router;