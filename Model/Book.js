const mongoose = require('mongoose')
const Schema =  mongoose.Schema 

const bookingsSchema =  new Schema({
    
        name:{
            type:String,
            required:true
        } ,
        phoneNumber:String,
        model:String ,
        make:String ,
        date:Date , 
          time:String
   }
);

bookSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    books:[
        bookingsSchema
       ]
}
    ,
    {
        timestamps:true
    }
)

book =  mongoose.model('Book', bookSchema)
module.exports =  book;