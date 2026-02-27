const campground=require('./models/campground.js')
const review=require('./models/review.js')
const {campSchema,reviewSchema}=require('./schemas.js')
const ExpressError=require('./utils/ExpressError.js')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error',"You must be signed in")
        return res.redirect('/login')
    }
    next()
}

module.exports.returnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo
    }
    next()
}

module.exports.isAuthor=async (req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    if(!camp.owner.equals(req.user._id)){
        req.flash('error','you do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground=function(req,res,next){
    if(!req.body){
        return next(new ExpressError("No data is send",400))
    }
    const {error}=campSchema.validate(req.body)
    if(error){
        const msg=error.details.map((er)=> er.message).join(',')
        return next(new ExpressError(msg,400))
    }
    else{
        next();
    }
}

module.exports.validateReview=function(req,res,next){
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

module.exports.isReviewAuthor=async (req,res,next)=>{
    const {reviewId,id}=req.params
    const userReview=await review.findById(reviewId);
    if(!userReview.owner.equals(req.user._id)){
        req.flash('error','you do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}