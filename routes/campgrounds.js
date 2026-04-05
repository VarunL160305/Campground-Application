const express=require('express');
const router=express.Router();
const multer=require('multer')
require('dotenv').config()
const {storage}=require('../Cloudinary/index.js')
const upload=multer({storage})

const Campgrounds=require('../controllers/campgrounds.js')

const {isLoggedIn, isAuthor,validateCampground}=require('../middleware.js')

const campground=require('../models/campground.js')

const ExpressError=require('../utils/ExpressError.js')
const CatchAsyncError=require('../utils/CatchAsyncError.js');


router.get('/',CatchAsyncError(Campgrounds.index))

router.get('/new',isLoggedIn,Campgrounds.renderNewCampgroundForm)

router.get('/:id',CatchAsyncError(Campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,CatchAsyncError(Campgrounds.renderEditCampgroundForm))

router.post('/',isLoggedIn,upload.array('image'),validateCampground,CatchAsyncError(Campgrounds.createCampground))

router.patch('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,CatchAsyncError(Campgrounds.updateCampground))

router.delete('/:id',isLoggedIn,isAuthor,CatchAsyncError(Campgrounds.deleteCampground))

module.exports=router