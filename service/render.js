
exports.home =  (req ,res, render)=>{


res.render("Home" , {
  
});
}

exports.aboutus =  (req ,res,next)=>{
    res.render("About-us" ,{
    
    });
}

exports.ContactUs =  (req ,res,next)=>{

    res.render("Contact-us" ,{
    
    });
}

exports.getBookPage =  (req ,res,next)=>{
    res.render("book");
}