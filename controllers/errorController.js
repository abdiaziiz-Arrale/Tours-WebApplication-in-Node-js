module.exports = (err, req, res, next)=>{
    console.log(err.stack);
    err.statusCode = err.statusCode ||500;

    err.status= err.status || 'error';

   if ( process.env.NODE_ENV === 'production'){
    // in operational send messages to clients
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
    else if ( process.env.NODE_ENV === 'development'){
            res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error:err,
      stack: err.stack
    
    })
    }

  
  }