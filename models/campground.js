const mongoose=require('mongoose');
const Review=require('./review.js');

const imageSchema=new mongoose.Schema({
    url:String,
    filename:String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = { toJSON: { virtual: true } };

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
    geometry:{
        type:
        {
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

campgroundSchema.post('findOneAndDelete',async function(camp) {
    if(camp){
        await Review.deleteMany({_id:{$in:camp.reviews}})
    }
})

module.exports=mongoose.model('campground',campgroundSchema)