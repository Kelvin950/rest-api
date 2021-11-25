const mongoose = require('mongoose')
const Schema =  mongoose.Schema 


favoriteSchema = new Schema({
  

    car:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cars'
    }],

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}
    ,
    {
        timestamps:true
    }
)

favorite =  mongoose.model('favorite', favoriteSchema)
module.exports =  favorite