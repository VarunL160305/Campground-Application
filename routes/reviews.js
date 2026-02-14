const express=require('express');
const router=express.Router({mergeParams:true});

const {reviewSchema}=require('../schemas.js')

const Review=require('../models/review.js')
const campground=require('../models/campground.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');

const validateReview=function(req,res,next){
    if(!req.body){
        return next(new ExpressError('No data is available',400))
    }
    const{error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map((er)=> er.message).join(',')
        return next(new ExpressError(msg,400))
    }
    else{
        next();
    }
}

router.post('/',validateReview,CatchAsyncError(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    const review=new Review(req.body)
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success',"created new review")
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewId',async(req,res)=>{
    const {id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success',"successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
})

module.exports=router