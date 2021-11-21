const jwt =  require("jsonwebtoken");
require("dotenv").config();
const {errorHandler} = require("./errorHandler");
exports.isAuth = (req ,res, next)=>{
const authHeader =  req.get("Authorization");
 if(!authHeader){
       errorHandler(req ,res,next , 'Not authenticated' , 401 );

 }

 const token =  authHeader.split(" ")[1];
 let decoded ;
 try{
     decoded =  jwt.verify(token , process.env.secret);
     console.log(decoded);
 }catch(err){
       err.statusCode =  500;
       throw err;
 }

 if(!decoded){
     errorHandler(req ,res,next  , "You are not authenticated" , 401);
 }
 req.userId =  decoded.id;
 next();
}; 