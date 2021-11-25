const mongoose = require('mongoose')
const Schema =  mongoose.Schema 


booSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    car:[
        {
         name:{
             type:String,
             required:true
         } ,
         phoneNumber:String,
         model:String ,
         make:String ,
         date:String ,
         time:String
    }]
}
    ,
    {
        timestamps:true
    }
)

boo =  mongoose.model('Favourites', booSchema)
module.exports =  boo;