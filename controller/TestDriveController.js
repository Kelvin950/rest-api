const Book =  require("../Model/Book")


exports.postBook = async (req,res,next)=>{

try{
    
    const {name , phone , model , make , date , time} = req.body

    const userId =  req.user._id;
console.log(userId);
    const book =  await Book.findOne({user:userId});
         const obj={
             name:name ,
             phone:phone ,
             model:model,
             make:make,
             date:date ,
             time:time
         }
    if(!book){

        const newBook=  await Book({
            user:userId,
          book:[obj]
        }).save() ;
        req.flash("message" , "Done wait for confirmation email");
       return res.redirect("/testdrive");
    }

 book.book.push(obj);
 await book.save()
    req.flash("message", "Done wait for confirmation email");
  return  res.redirect("/testdrive");

}catch(err){
    console.log(err)
 return res.statusCode = 500;
 
}
    


}


exports.getTestDrive  = (req ,res,next)=>{
  let message=  req.flash("message");
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
    }
    res.render("book" , {
        message:message
    });


}
