const Car = require("../Model/Car");
const { errorHandler } = require("../util/errorHandler");

exports.getSearch = async (req, res, next) => {
  try {
      const {search} =  req.query;
      search.toLowerCase().trim();

    let cars = await Car.find({$text:{$search:search}}, {score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}});
    console.log(cars);

    if (!cars) {
      errorHandler("no cars found", 404);
    }
        if(cars.length<1){
          errorHandler("search not found" , 404);
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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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
             let car = await Car.findById(carId) ;

            if(!car){
                errorHandler("Car not found" , 404);
            }
          

          
          
              res.status(200);
              res.json({
                  message:"succeeded",
                  car:car
              })
        }
        catch(err){
            if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
        }
     


    }



exports.getCarOntype   = async (req,res,next)=>{

 const{type ,value} = req.params ;
console.log(value , type)
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