const mongoose = require("mongoose");


module.exports =  async  function connectDb(){

        try{

         const connect =  await    mongoose.connect(process.env.Mongo_URL  ,{
             useUnifiedTopology:true , useNewUrlParser:true , useCreateIndex:false , useFindAndModify:false
              
         }) ;
                    console.log(connect.connection.host);
        }
        catch(err){
            throw err
        }

}