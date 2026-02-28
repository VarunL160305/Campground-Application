const express=require('express');
const router=express.Router({mergeParams:true});

const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js')

const Review=require('../models/review.js')
const campground=require('../models/campground.js')

const Reviews=require('../controllers/reviews.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');


router.post('/',isLoggedIn,validateReview,CatchAsyncError(Reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,Reviews.deleteReview)

module.exports=router