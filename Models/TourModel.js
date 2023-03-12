const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const tourSchema= mongoose.Schema({
    name : {
      type :String,
      unique :true,
      required:[true,"tour must have Name"],
      maxlength:[40,'please Tour Must have less than 40 characters'],
      minlength:[10,'please Tour Must have less than 20 characters  '],
      // validate:[validator.isAlpha,'Please tour must be charactericts']
    },
    slug:String,
    ratingsAverage: {
      type:Number,
      default :4.5,
      max:[5,'please Tour Must have Rating less than 5 characters'],
      min:[1,'please Tour Must have less Rating than 1 characters  ']
    },
    ratingsQuantity: {
      type:Number,
      default :0
    },
    price: {
      type :String,
      required:[true,"tour must have Price"],
    },
    duration: {
        type:Number,
        required:[true,'Tour Must have Duration'],
    },
    maxGroupSize: {
        type:Number,
        required:[true,'Tour must have Max Group Size'],
    },
    difficulty: {
        type:String,
        required:[true,'Tour must have Difficulty'],
        enum:{
          values: ['easy', 'medium', 'difficult'],
     message:'Tour must have rthier difficulty easily medium',
        }
    
    },
    priceDiscount:{
     type: Number,
//      validate:{
//       validate: function(value){
// return value < this.price;
//       },
//       message: 'Discount must below the price',
//      }

    } ,
    summary:{
        type:String,
        trim:true,
        required:[true,'Tour must have Summary'],
        // maxlength:[100,'please Tour Must have less than 40 characters'],
        minlength:[10,'please Tour Must have less than 20 characters  ']
    },
 
    description:{
        type:String,
        trim:true,
        required:[true,'Tour must have description'],
    },
   
    imageCover:{
        type:String,
  
        required:[true,'Tour must have Summary'],
    },
    images:[String],
        createAt:{
            type:Date,
            default:Date.now(),
            select:false,
        },
        startDates:[Date],

        
      },
      {
        toJSON: {virtuals :true},
        ToObject:{virtuals :true}
      })
      tourSchema.virtual('durationWeeks').get(function() {
        return this.duration / 7;
      });
      tourSchema.pre("save", function() {
        console.log("hello from doc middleware",this); 
      })
      tourSchema.pre('save', function(next) {
        this.slug = slugify(this.name, { lower: true });
        next();
      });
      tourSchema.pre(/^find/, function(next) {
        this.find({ secretTour: { $ne: true } });
      
        this.start = Date.now();
        next();
      });
      
      tourSchema.post(/^find/, function(docs, next) {
        console.log(`Query took ${Date.now() - this.start} milliseconds!`);
        next();
      });
      
      // AGGREGATION MIDDLEWARE
      tourSchema.pre('aggregate', function(next) {
        this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
      
        console.log(this.pipeline());
        next();
      });
      
  const TourModel = mongoose.model("TourModel",tourSchema);
module.exports= TourModel; 