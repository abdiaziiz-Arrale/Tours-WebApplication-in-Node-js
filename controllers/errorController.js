const AppError = require('../util/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next)=>{

    err.statusCode = err.statusCode ||500;

    err.status= err.status || 'error';

 
     if ( process.env.NODE_ENV === 'devolopment'){
      let error ={...err}
      if (error.name==='CastError') error =handleCastErrorDB(error);
            res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error:err,
      stack: err.stack
    
    })
    }
    else if ( process.env.NODE_ENV === 'production'){
      // in operational send messages to clients
      let error ={...err}
      if (error.name==='CastError') error =handleCastErrorDB(error);
      if(err.isOperation){
             res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
  
  
        
        }) 
      }
      //programiing or other Unknown error
      else{
          console.error('ERROR 🪓',err)
          res.status(err.statusCode).json({
              status:"error",
              message:"Something went very wrong"
          })
      }
  
      }

  
  }