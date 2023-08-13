const tryCatch = (functionArgument) => async (req,res,next) =>{
    try{
       await functionArgument(req,res,next);
    }catch(err){
        next(err);
    }
}
module.exports = tryCatch;