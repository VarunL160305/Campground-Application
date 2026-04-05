const campground=require('../models/campground.js')
const {cloudinary}=require('../Cloudinary')

module.exports.index=async(req,res)=>{
    const data=await campground.find();
    res.render('campgrounds/index.ejs',{data})
}

module.exports.renderNewCampgroundForm=async(req,res)=>{
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground=async(req,res,next)=>{
    const {title,location,description,price,image}=req.body;
    const addCamp=new campground ({title,location,description,price,image,owner:req.user._id});
    addCamp.images=req.files.map(i=>({url:i.path,filename:i.filename}))
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
    console.log(req.body)
    const {title,location,description,price,image}=req.body;
    const updateCamp=await campground.findByIdAndUpdate(id,{title,location,description,price,image},{runValidators:true})
    updateCamp.images.push(... req.files.map(i=>({url:i.path,filename:i.filename})))
    await updateCamp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await updateCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success',"successfully updated Campground")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async(req,res,next)=>{
    const { id } = req.params;
    const camp = await campground.findById(id);
    for (let img of camp.images) {
        await cloudinary.uploader.destroy(img.filename);
    }
    await campground.findByIdAndDelete(req.params.id)
    req.flash('success',"successfully deleted Campground")
    res.redirect('/campgrounds')
}