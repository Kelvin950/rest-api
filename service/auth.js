exports.login =  (req ,res,next)=>{
    let error= req.flash("error");
    if(error.length > 0){
   
         error=error[0]
    }else{
        
        error=null
    }
    res.render("login", {
        title:"Login",
        error:error
    });
}

exports.signup =  (req,res,next)=>{

    let error= req.flash("error");
  if(error.length > 0){
 
       error=error[0]
  }else{
      
      error=null
  }
    res.render("signup" , {
        title:"Sign up",
        error:error
    })
}