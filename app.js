const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const mongoose = require("mongoose");
const tourRouter = require('./Router/tourRoutes');
const userRouter = require('./Router/userRoutes');
const AppError= require('./util/AppError');
const globalErrorHandler= require('./controllers/errorController');


const app = express();

// const DB= process.env.DATABASE.replace("<PASSWORD>",process.env.PASSWORD);
// //  in remotely
// mongoose.connect(DB,{
//   useCreateIndex:true,
//   useNewUrlParser:true,
//   useFindAndModify:false,
// }).then(con =>{

//   console.log("DB Connect Succesful")
// }
// )


// in locally connecting Database
mongoose.connect(process.env.DATABASE_LOCAL,{
  useCreateIndex:true,
  useNewUrlParser:true,
  useFindAndModify:false,
  useUnifiedTopology: true
}).then(con=>{


  console.log("DB Connect Succesful")

}


).catch(err=>{
  console.log("DB does not Connect succesful");
})


if(process.env.NODE_ENV==="devolopment"){

    app.use(morgan('dev')); 
}
console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(express.static(`${__dirname}/public`))


// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*',  (req, res,next)=>{
  // res.status(400).json({
  //   message: `This Route${req.originalUrl} Does Not Exist`
  
  // });
  // const err = new Error(`This Route${req.originalUrl} does not exist`);
  // err.status ='failed';
  next(new AppError(`This Route${req.originalUrl} Does Not Exist`,400));
  
});
app.use(globalErrorHandler)

module.exports= app;

