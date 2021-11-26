
exports.home =  (req ,res, render)=>{


res.render("Home" , {
  title:"Home"
});
}

exports.aboutus =  (req ,res,next)=>{
    res.render("About-us" ,{
    title:"About"
    });
}

exports.ContactUs =  (req ,res,next)=>{

    res.render("Contact-us" ,{
        title:"Contact"
    
    });
}

exports.getBookPage =  (req ,res,next)=>{
    res.render("book" , {
        title:"Test drive"
    });
}