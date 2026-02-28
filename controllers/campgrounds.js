const campground=require('../models/campground.js')

module.exports.index=async(req,res)=>{
    const data=await campground.find();
    res.render('campgrounds/index.ejs',{data})
}

module.exports.renderNewCampgroundForm=async(req,res)=>{
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground=async(req,res,next)=>{
    const {title,location,description,price,image}=req.body;
    const addCamp=new campground ({title,location,description,price,image,owner:res.locals.currentUser._id});
    await addCamp.save();
    req.flash('success',"successfully made a new Campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}

module.exports.showCampground=async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'owner'
        }
    }).populate('owner');
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs',{camp})
}

module.exports.renderEditCampgroundForm=async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    if(!camp){
        req.flash('error',"Cannot find the Campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs',{camp})
}

module.exports.updateCampground=async(req,res,next)=>{
    const {id}=req.params
    const {title,location,description,price,image}=req.body;
    await campground.findByIdAndUpdate(id,{title,location,description,price,image},{runvalidators:true})
    req.flash('success',"successfully updated Campground")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async(req,res,next)=>{
    await campground.findByIdAndDelete(req.params.id)
    req.flash('success',"successfully deleted Campground")
    res.redirect('/campgrounds')
}