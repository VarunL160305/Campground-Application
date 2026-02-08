const mongoose=require('mongoose');
const Review=require('./review.js')

const campgroundSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]
})

campgroundSchema.post('findOneAndDelete',async function(camp) {
    if(camp){
        await Review.deleteMany({_id:{$in:camp.reviews}})
    }
})

module.exports=mongoose.model('campground',campgroundSchema)