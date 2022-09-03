module.exports = (error, req , res, next)=>{
    if(error){
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }

    next();
}