// const fs = require('fs');
const { json } = require('express');
const APIFeature= require('../util/APIFeature');
const catchAsync= require('../util/catchAsync');
const AppError= require('../util/AppError');
const Tour= require('../Models/TourModel');



// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

exports.getAllTours =catchAsync(async (req, res,next) => {


const Feature = new APIFeature(Tour.find(),req.query)
.filter()
.limitFields();

const Tours= await Feature.query;
  res.status(200).json({
    status: 'success',
    results: Tours.length,
    data:{
  
      Tours
    }
  });



});

exports.getTour = catchAsync(async(req, res,next) => {
  // const id =  * 1;
  console.log(req.params.id);

    const tour = await Tour.findById(req.params.id);
  if(!tour){
 
    return next(new AppError('No tour for This Id found',404));
  }
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  


});

exports.createTour = catchAsync(async (req, res,next) => {
  
 const newTour = await Tour.create(req.body);

 res.status(200).json({
  status: 'success',
  data: {
    newTour
 },
})

})

exports.updateTour = catchAsync(async(req, res,next) => {

     const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
      new :true,
      runValidators:true
     })
  res.status(200).json({
    status: 'success',
    data: {
      tour: updateTour,
    }
  }); 
  

});

exports.deleteTour = catchAsync(async(req, res,next) => {
  const DeleteTour= await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      message: ` this ${req.params.id} tour has been deleted`
    });

  
});
exports.getStatus =catchAsync(async(req, res,next)=>{

const stats = await Tour.aggregate([
  {
    $match:{ ratingsAverage:{ $gte: 4.5 }}
  },
  {
    $group:{
      _id:'$difficulty',
      avgRating:{ $avg :'$ratingsAverage'},
      avgPrice:{ $avg :'$price'},
      max:{ $max :'$price'},
      min:{ $min :'$price'},
      numberTour:{$sum:1}
    }
  }
]);

res.status(200).json({
  status: 'success',
  data:{
    stats
  }

});
  
})
exports.planmonthly=catchAsync( async(req, res,next)=>{

const year = req.params.year *1;
console.log(Tour.length);
  var plan = await Tour.aggregate([
    {
      $unwind :'$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group : {
        _id: {$year:'$startDates'},
        sumnumber:{$sum:1},
        Tours:{$push :'$name'},
        avgrating:{$avg:'$ratingsAverage'},
      }
    }
  ]);
  console.log(plan);
  res.status(200).json({
    status: 'success',
    data:{
      plan
    }
  
  });

 
  
})
exports.getTotalPrice =catchAsync(async (req, res,next) => {

    const year = req.params.year;

    const totalprice = await Tour.aggregate([
      {
        $unwind:'$price'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      
      {
        $project:{
          _id: '$price',
          totalAmount: { $min: "$price" },
          total : {$sum : "$price"},
          //  count: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data:{
        totalprice
      }
    
    });

  

});
