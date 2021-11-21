const Car = require("../Model/Car");
const { errorHandler } = require("../util/errorHandler");

exports.getCars = async (req, res, next) => {
  try {
      const {search} =  req.query
    let cars = await Car.find({$text:{$search:search}});
    console.log(cars);

    if (!cars) {
      errorHandler("no cars found", 404);
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
      message: "succeede1d",
      cars: cars,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSearch =  async(req , res ,next)=>{

    const filters =  req.query;

    try{
    
        const cars =  await Car.find();

        if(!cars){
            
            errorHandler("cars not found" , 404);
        }

        const  filteredCars=  cars.filter(car=>{

            let isValid =  true ; 
            for(key in filters){
                console.log(key , car[key] , filters[key])
                isValid =  isValid && car[key] == filters[key];
            }
            return isValid;
        });

         if(filteredCars.length < 1){
             res.status(404);
             res.json({message:"Search not found"});
         }
         res.status(200);
         res.json({
             message:"Succeeded",
             search:filteredCars
         })
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
            car = car.map((car) => {
                return {
                  headPic: car.headPic,
                  model: car.model,
                  make: car.make,
                  price: car.price,
                  _id:car._id
                };
              });
          
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