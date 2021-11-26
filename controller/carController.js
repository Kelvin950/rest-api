const Car = require("../Model/Car");
const { errorHandler } = require("../util/errorHandler");
const favorite =  require("../Model/favourites");
const Favorite =  require("../Model/Favorites");

function errorCode(err){
  if(!err.statusCode){
    err.statusCode =  500
  } ;
    return err.statusCode

} 
exports.getSearch = async (req, res, next) => {
  try {
      const {search} = req.query;
//  console.log("dsjdds")
    let cars = await Car.find({$text:{$search:search}}, {score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}});
    // console.log(cars);

    if (!cars) {
      return   res.render("carPages" , {
        
        title:search , 
        cars:[],message:null ,error:null
        
       })
    }
        if(cars.length<1){
          return   res.render("carPages" , {
        
            title:"Not found!" , 
            cars:[],message:null ,error:null
            
           })
        }
    cars = cars.map((car) => {
      return {
        headPic: car.headPic,
        model: car.model,
        make: car.make,
        price: car.price,
        _id:car._id
      };
    });

    res.statusCode = 200;
    let message=  req.flash("message");
      let error= req.flash("error");
    if(message.length > 0 && error.length <= 0){
        message=message[0]
         error=null
    }else{
        message=null;
        error=error[0]
    }
    
  res.render("carPages" , {
      title:search ,
       cars:cars,
        message:message , 
        error:error
       
  });
  } catch (err) {
    // console.log(err)
   res.statusCode  =  errorCode(err);
}}
exports.getCars =  async(req , res ,next)=>{

    
    try{
    
        let cars =  await Car.find();

        if(!cars){
            
            errorHandler("cars not found" , 404);
        }
        cars = cars.map((car) => {
          return {
            headPic: car.headPic,
            model: car.model,
            make: car.make,
            price: car.price,
            _id:car._id
          };
        });
    
        res.statusCode = 200;
        res.json({
          message: "succeeded",
          cars: cars,
        });
        
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.getSingleCar = async (req , res, next)=>{

     const {carId} =  req.params ;
         
        try{
          // console.log(carId);
             let car = await Car.findById(carId) ;

            if(!car){
                errorHandler("Not found" , 404)
            }
          
    // console.log(car)
          
          
              res.status(200);
              // res.json({
              //     message:"succeeded",
              //     car:car
              // })
              res.render("carPage" , {
               title:car.model ,
               car:car,
                otherImages:car.otherImages,
                length:car.otherImages.length,
               
                

             } )
        }
        catch(err){
        
           res.statusCode  =  errorCode(err);
        }
     


    }



exports.getCarOntype   = async (req,res,next)=>{

 const{type ,value} = req.params ;
// console.log(value , type)
 try{

      const obj = {[type]:value}
  let cars =  await Car.find({ [type]: value })
    
    if(!cars){
        errorHandler("No cars found" ,404);
    }
     
    
    cars = cars.map((car) => {
        return {
          headPic: car.headPic,
          model: car.model,
          make: car.make,
          price: car.price,
          _id:car._id
        };
      });
  
      res.statusCode = 200;
      res.json({
        message: "succeeded",
        cars: cars,
      })



 }catch(err){
     if(!err.statusCode){
         err.statusCode  = 500;
     }
     next(err);
 }
}


exports.getCarOnMake   = async (req,res,next)=>{

  const{make} = req.params;
//  console.log(make)
  try{
 
      //  const obj = {[type]:value}
   let cars =  await Car.find({ make:make.toUpperCase() })
     
     if(cars.length<=0){
   return   res.render("carPages" , {
        
        title:make, 
        cars:[],message:null ,error:null
        
       })
     }
      
     
     cars = cars.map((car) => {
         return {
           headPic: car.headPic,
           model: car.model,
           make: car.make,
           price: car.price,
           _id:car._id,
           
         };
       });
   
       res.statusCode = 200;
      // console.log(cars)
      let message=  req.flash("message");
      let error= req.flash("error");
    if(message.length > 0 && error.length <= 0){
        message=message[0]
         error=null
    }else{
        message=null;
        error=error[0]
    }
    
       res.render("carPages" , {
        
        title:cars[0].make , 
        cars:cars,message:message ,error:error
        
       })
 
 
  }catch(err){
        
    res.statusCode  =  errorCode(err);
 }};


 exports.addFavourites = async (req,res,next)=>{
      
  try{
  const {carId} = req.params;
 const userId =  req.user._id

 const car = await Car.findById(carId);
     if(!car){
         
      req.flash("error" ,"Car not found");
            return res.redirect(`/brand/${car.make}`)
    
     }
      const fav  =  await favorite.findOne({user:userId});
      
            if(!fav){
           
              const obj = {
                user:userId , 
                car :[carId]
              }
            let newFav = await new favorite(obj);

             newFav.save() ;
       
             res.status = 200;
            
             req.flash("message" ,"Added to favourite");
             return res.redirect(`/brand/${car.make}`)

             
            }
       else{

        const favExist =  fav.car.indexOf(carId);
         if(favExist > -1){
          req.flash("error" ,"Already added to favourite");
            return res.redirect(`/brand/${car.make}`)
         }else{
           fav.car.push(carId)
           await fav.save() ; 
           req.flash("message" ,"Added to favourite");
           return res.redirect(`/brand/${car.make}`)
         }
       }
         
      }catch(err){

        res.statusCode  =  errorCode(err);
      }


 }

exports.deleteFav = async (req,res,next)=>{

  const {carId} = req.params;
  const userId =  req.user._id ;
        
       const fav  =  await favorite.findOne({user:userId});

      if(!fav){
         
        return res.redirect("/favorite");
      }

      if(fav.car.indexOf(carId) >=0 ){
           
         fav.car.pull(carId)
         await fav.save();
        return res.redirect("/favorite")
      }
      else{
       
        return res.redirect("/favorite")
      }

}


exports.getFav=  async (req,res,next)=>{

  const userId =  req.user._id ;
        try{
       const fav  =  await favorite.findOne({user:userId}).populate("user").populate("car")
        if(!fav){
       
    
       return res.render("carPages" , {
        
        title:"favourite", 
        cars:[],message:null ,error:null 

    
       })
        }
      
      // console.log(fav)
      
         res.render("carPages" , {
          
          title:"favourite" , 
          cars:fav.car,message:null ,error:null 
      
         })
        }catch(err){
          // console.log(err)
          res.statusCode =  errorCode(err);
        }
}