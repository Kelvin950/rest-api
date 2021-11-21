  const fs =  require("fs");
  const path =  require("path");
exports.errorHandler =   ( errorMessage , errorStatusCode , errorData)=>{

    const error = new Error(errorMessage);
    error.statusCode =  errorStatusCode ;
    error.data =  errorData ;
    throw error;
}

exports.deleteImage =  filepath=>{
 let fp  = path.resolve(__dirname ,".." , "asserts/"+filepath);
    fs.unlink(fp , (err)=>{
     
        if(err){
            throw err;
        }
    })
}