const express=require('express');
const router=express.Router();

const {campSchema}=require('../schemas.js')

const {isLoggedIn}=require('../middleware.js')

const campground=require('../models/campground.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');

const validateCampground=function(req,res,next){
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


router.get('/',async(req,res)=>{
    const data=await campground.find();
    res.render('campgrounds/index.ejs',{data})
})
router.post('/',isLoggedIn,validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {title,location,description,price,image}=req.body;
    const addCamp=new campground ({title,location,description,price,image});
    await addCamp.save();
    req.flash('success',"successfully made a new Campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

router.get('/new',isLoggedIn,async(req,res)=>{
    res.render('campgrounds/new.ejs');
})

router.get('/:id',CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs',{camp})
}))

router.get('/:id/edit',isLoggedIn,CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs',{camp})
}))

router.patch('/:id',isLoggedIn,validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const {title,location,description,price,image}=req.body;
    await campground.findByIdAndUpdate(id,{title,location,description,price,image},{runvalidators:true})
    req.flash('success',"successfully updated Campground")
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id',isLoggedIn,CatchAsyncError(async(req,res,next)=>{
    await campground.findByIdAndDelete(req.params.id)
    req.flash('success',"successfully deleted Campground")
    res.redirect('/campgrounds')
}))

module.exports=router