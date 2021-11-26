const express=  require("express");
const path  = require("path")
const  app  = express();
const logger =  require("morgan")
const multer =  require("multer");
const connectDb =  require("./database/connectDb");
const { errorMonitor } = require("events");
const helmet =  require("helmet");
const adminRoute =  require("./routes/admin")
const carRoute =  require("./routes/carRoutes")
const session =  require("express-session");
const authRoute =  require("./routes/UserRoute");
const homeRoute =  require("./routes/home");
const newSLetterRoute =  require("./routes/newsLetterRoute");
const flash =  require("connect-flash");
const testDriveRoute =  require("./routes/testDriveroute");
const favRoute =  require("./routes/favourites");
var favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, 'public' ,"img" ,"favicon.ico")))
const User =  require("./Model/User")
const compression=require("compression")

require("dotenv").config();
// app.use(helmet());
app.use(compression());
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
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5}])
  );
app.use("/img" , express.static(path.resolve(__dirname , "public/img")))
app.use("/css" , express.static(path.resolve(__dirname , "public/css")));
app.use("/fonts" , express.static(path.resolve(__dirname , "public/fonts")));
app.use("/js" , express.static(path.resolve(__dirname , "public/js")))
app.use("/scss" , express.static(path.resolve(__dirname , "public/scss")));
app.use("/vendor" , express.static(path.resolve(__dirname , "public/vendor")));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  
  }));
  app.use(flash());
   app.use((req, res, next) => {
    if (!req.session.user) {
        req.user =false
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if(req.user)res.locals.username = req.user.name
    else res.locals.username = null
   
    next();
  });
 
app.use("/" , homeRoute);

// app.get("/Error403" , (req ,res,next)=>{

 
//   res.render("403page",{
//     title:"Forbidden"
   
//   });
// })
app.use(adminRoute);
app.use(carRoute);
app.use(authRoute);
app.use(testDriveRoute);
app.use(favRoute);
app.use( newSLetterRoute);
app.use((error , req , res, next)=>{
         
          //  console.log(error)
    res.status(error.statusCode||500);
    res.json({
        errorStatusCode :  error.statusCode,
        errorMessage:error.message
    });
    
})

app.use((req ,res,next)=>{

  res.statusCode=404 ;
  res.render("Errorpage",{
    title:"Error 404"
  });
})



// app.listen(3000 , ()=>{
//     console.log("http://localhost:3000")
// });


