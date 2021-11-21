const express=  require("express");
const path  = require("path")
const  app  = express();
const logger =  require("morgan")
const multer =  require("multer");
const connectDb =  require("./database/connectDb");
const { errorMonitor } = require("events");
const adminRoute =  require("./routes/admin")
const carRoute =  require("./routes/carRoutes")
require("dotenv").config();
 connectDb();
app.use(logger("dev"));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin" , "*");
    res.setHeader("Access-Control-Allow-Methods" , "*" );
    res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Origin", "*")
    //   if(req.method="OPTION"){
    //       res.sendStatus(200);
    //   }
     next();
});
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/img');
    },
    filename: (req, file, cb) => {
      cb(null,  file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5}])
  );
app.use("/img" , express.static(path.resolve(__dirname , "public/img")))

app.use("/admin" ,adminRoute);
app.use("/car" , carRoute);
app.use((error , req , res, next)=>{
         
           console.log(error)
    res.status(error.statusCode||500);
    res.json({
        errorStatusCode :  error.statusCode,
        errorMessage:error.Message 
    });
    
})



app.listen(3000 , ()=>{
    console.log("http://localhost:3000")
});


