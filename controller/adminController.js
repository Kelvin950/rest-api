const Car = require("../Model/Car");
const {errorHandler , deleteImage } =  require("../util/errorHandler")
exports.createData = async (req, res, next) => {
  try {
    if (!req.files["image"][0] && !req.files["gallery"]) {
      const error = new Error(" no file submitted");
      error.statusCode = 422;
      throw error;
    }

    console.log(req.body, req.files);

    const {
      model,
      make,
      year,
      engineCapacity,
      seating,
      horsepower,
      fueltype,
      transmission,
      enginetype,
      price,
    } = req.body;

    const headPic = req.files["image"][0].path.replace(/\\/g, "/").slice(7);
    const otherImages = req.files["gallery"].map((g) => {
      return g.path.replace(/\\/g, "/").slice(7);
    });

    const carDetails = {
      model: model,
      make: make,
      price: +price,
      year: year,
      headPic: headPic,
      otherImages: otherImages,
      specification: {
        engineCapacity: engineCapacity,
        transmission: transmission,
        seating: +seating,
        horsepower: horsepower,
        fueltype: fueltype,
        enginetype: enginetype,
      },
    };
    const saveCarDetails = await new Car(carDetails).save();

    res.status(200);
    res.json({
      message: "done",
      saveCarDetails: saveCarDetails,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.updateCarDet = async (req ,res,next)=>{

  const {carId} =req.params ;

  try{
    console.log("ncnc")
  if(!req.files["image"][0] && !req.files["gallery"]){

    errorHandler("no files uploaded" ,422);
  }
   
  const { updatedmodel,
    updatedmake,
    updatedyear,
    updatedengineCapacity,
    updatedseating,
    updatedhorsepower,
    updatedfueltype,
    updatedtransmission,
    updatedenginetype,
    updatedprice,
  
  }=   req.body ;

 const updatedheadPic =  req.files["image"][0].path.replace(/\\/g ,"/").slice(7);
      const updatedOtherImages =  req.files["gallery"].map(g=> g.path.replace(/\\/g, "/").slice(7));
    const car=  await Car.findById(carId)
    console.log(car);

    if(!car){
      errorHandler("Car does not exist" , 404);

    }
    console.log(car);
    
   
    const newCar =  {
      model: updatedmodel,
      make: updatedmake,
      price: +updatedprice,
      year: updatedyear,
      headPic: updatedheadPic,
      otherImages: updatedOtherImages,
      specification: {
        engineCapacity: updatedengineCapacity,
        transmission: updatedtransmission,
        seating: +updatedseating,
        horsepower: updatedhorsepower,
        fueltype: updatedfueltype,
        enginetype: updatedenginetype,
      },
    }
    const updatedCarDet =  await Car.updateOne({_id:car._id} , {$set:newCar} , {new:true})
   if(!updatedCarDet){
     errorHandler("failed" , 500)
   }
   deleteImage(car.headPic);

    car.otherImages.forEach(image=> deleteImage(image));
    res.status(200);
    res.json({
      message:"succeeded" , 
      carDetails :updatedCarDet
    })


  }catch(err){

    if(!err.statusCode){
       err.statusCode = 500 ;
       next(err);
    }
  }



}


exports.deleteCarDet = async (req ,res,next)=>{

const  {carId}  = req.params ; 
    
try{

  const car =  await Car.findById(carId);
  if(!car){

    errorHandler("car does not exist" , 404);
  }

  const headpic=  car.headPic ;
  const otherImages =  car.otherImages ;

  await Car.findByIdAndRemove(carId);
  deleteImage(car.headPic);
  otherImages.forEach(images=> deleteImage(images))

   res.statusCode=  200;
   res.json({message:"succeeded"})
}catch(err){
  if(!err.statusCode){
    err.statusCode  = 500;
  }
}

}