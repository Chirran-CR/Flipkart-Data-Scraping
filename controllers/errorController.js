const notFound = (req,res,next) =>{
    const err = new Error(`Address not found:${req.originalUrl}`);
    res.status(400);
    next(err);
}

const errorHandler = (error,req,res,next) =>{
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.send({
        errorMessage:error.message,
        errorName:error.name
    })
}

module.exports = {
    notFound,
    errorHandler
}