const express=require('express');
const router=express.Router({mergeParams:true});

const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js')

const Review=require('../models/review.js')
const campground=require('../models/campground.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');


router.post('/',isLoggedIn,validateReview,CatchAsyncError(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    const review=new Review(req.body)
    review.owner=req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success',"created new review")
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,async(req,res)=>{
    const {id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success',"successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
})

module.exports=router