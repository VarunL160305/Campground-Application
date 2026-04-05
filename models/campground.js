const mongoose=require('mongoose');
const Review=require('./review.js');

const imageSchema=new mongoose.Schema({
    url:String,
    filename:String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const campgroundSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:[
        imageSchema
    ],
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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