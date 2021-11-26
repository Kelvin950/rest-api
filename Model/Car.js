const mongoose =require("mongoose");
const Schema  = mongoose.Schema ;

const spec= new Schema ({

    engineCapacity:String ,  seating:Number , horsepower:String , fueltype:String, transmission:String ,enginetype:String
})
const carSchema =  new Schema({

    model :{
        type:String , 
        required:true 
    },
    make:{
        type:String ,
        required:true 
    } ,
    year :{
        type:String,
        required:true
    } ,
    
price:{
    type:Number ,
    required:true
} ,
description:String,
headPic:{
    type:String,
    required:true
} ,
otherImages:[] ,
 specification:spec

}
,
 {
     timestamps:true
 }    
)

 module.exports = mongoose.model("Cars" , carSchema) ;