const mongoose = require('mongoose')
const Schema =  mongoose.Schema 


bookSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    book:[
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

book =  mongoose.model('Book', bookSchema)
module.exports =  book;