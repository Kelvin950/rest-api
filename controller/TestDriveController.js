const Book =  require("../Model/Book")
const { errorHandler } = require("../util/errorHandler");
const { validationResult } = require("express-validator");
const checkErrors = function (req, res, next, errorMessage, errorStatusCode) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   console.log(errors.array())
      errorHandler(errorMessage, errorStatusCode, errors.array());
      
    }
  };
exports.postBook = async (req,res,next)=>{

try{
    checkErrors(req, res, next, "Validation failed", 422);
    const {name , phone , model , make , date , time} = req.body

    const userId =  req.user._id;

    const book =  await Book.findOne({user:userId});
         const obj={
             name:name ,
             phone:phone ,
             model:model,
             make:make.toUpperCase(),
             date:date ,
             time:time
         }
        //  console.log(book)
    if(!book){

        const newBook=  await Book({
            user:userId,
          
        }).save() ;
        newBook.books.push(obj);
         await newBook.save()
        req.flash("message" , "Done wait for confirmation email");
       return res.redirect("/testdrive");
    }

 book.books.push(obj);
 await book.save()
//  console.log(book)
    req.flash("message", "Done wait for confirmation email");
  return  res.redirect("/testdrive");

}catch(err){
    // console.log(err)
    let error=err.data.map(data=>data.msg).join('\n')
    req.flash("message" ,error )
    // console.log(error);
    res.redirect("/testdrive")
 
}
    


}


exports.getTestDrive  = (req ,res,next)=>{
  let message=  req.flash("message");
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
     }
    // console.log(message)
    res.render("book" , {
        message:message ,
        title:"Test Drive"
    });


}
