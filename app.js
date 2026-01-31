//requiring required files
const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override')
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const joi=require('joi')
const port=3000;
require('dotenv').config();
const campSchema=require('./schemas.js')
const campground=require('./models/campground.js')
const ExpressError=require('./utils/ExpressError.js')
const CatchAsyncError=require('./utils/CatchAsyncError.js')

//DB Connection Part
mongoose.connect('mongodb://localhost:27017/YelpCamp')
.then(()=>{
    console.log("Connection Successful to DB");
})
.catch(()=>{
    console.log("Connection Error");
})

//Configuration of Set and Use
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_METHOD'))

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

//Routing paths
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds',async(req,res)=>{
    const data=await campground.find();
    res.render('campgrounds/index.ejs',{data})
})
app.post('/campgrounds',validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {title,location,description,price,image}=req.body;
    const addCamp=new campground ({title,location,description,price,image});
    await addCamp.save();
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

app.get('/campgrounds/new',async(req,res)=>{
    res.render('campgrounds/new.ejs');
})

app.get('/campgrounds/:id',CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    res.render('campgrounds/show.ejs',{camp})
}))

app.get('/campgrounds/:id/edit',CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id);
    res.render('campgrounds/edit.ejs',{camp})
}))

app.patch('/campgrounds/:id',validateCampground,CatchAsyncError(async(req,res,next)=>{
    const {id}=req.params
    const {title,location,description,price,image}=req.body;
    await campground.findByIdAndUpdate(id,{title,location,description,price,image},{runvalidators:true})
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id',CatchAsyncError(async(req,res,next)=>{
    await campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err
    if(!err.message){err.message="Something went Wrong"}
    res.status(statusCode).render('error.ejs',{err})
})


app.listen(port,()=>{
    console.log('listening in port 3000');
})