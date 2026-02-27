const express=require('express');
const router=express.Router();

const {campSchema}=require('../schemas.js')

const {isLoggedIn, isAuthor,validateCampground}=require('../middleware.js')

const campground=require('../models/campground.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');


router.get('/',async(req,res)=>{
    const data=await campground.find();
    res.render('campgrounds/index.ejs',{data})
})
router.post('/',isLoggedIn,validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {title,location,description,price,image}=req.body;
    const addCamp=new campground ({title,location,description,price,image,owner:res.locals.currentUser._id});
    await addCamp.save();
    req.flash('success',"successfully made a new Campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

router.get('/new',isLoggedIn,async(req,res)=>{
    res.render('campgrounds/new.ejs');
})

router.get('/:id',CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'owner'
        }
    }).populate('owner');
    console.log(camp)
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs',{camp})
}))

router.get('/:id/edit',isLoggedIn,isAuthor,CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs',{camp})
}))

router.patch('/:id',isLoggedIn,isAuthor,validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const {title,location,description,price,image}=req.body;
    await campground.findByIdAndUpdate(id,{title,location,description,price,image},{runvalidators:true})
    req.flash('success',"successfully updated Campground")
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id',isLoggedIn,isAuthor,CatchAsyncError(async(req,res,next)=>{
    await campground.findByIdAndDelete(req.params.id)
    req.flash('success',"successfully deleted Campground")
    res.redirect('/campgrounds')
}))

module.exports=router