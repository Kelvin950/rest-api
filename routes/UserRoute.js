const express =  require("express");
const {body} =  require("express-validator");
const User =  require("../Model/User");
const authController =  require("../controller/authController");
const router =  express.Router();
const passport =  require("passport")
const auth =  require("../service/auth");
router.use(express.json());
router.use(express.urlencoded({extended:false}))


router.route("/signup")
.get(auth.signup)
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
.get(auth.login)
.post(
// [
//         body("email" ,"Incorrect email").isEmail().trim() , body("password" , "Password should be eight to 16 characters long and alphanumeric").isAlphanumeric().isLength({min:8 , max:16})
//     ],
    authController.login
);

router.get("/logout" , authController.postLogout);
router.route("/requestPasswordReset")
.post(authController.requestPasswordReset);
router.route("/resetPassword")
.put(authController.resetPassword);

router.get('/auth/facebook/token', passport.authenticate('facebook-token') , authController.fbauth)


module.exports  =  router;