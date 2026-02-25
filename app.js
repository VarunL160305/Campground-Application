//requiring required files
const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override')
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const joi=require('joi')
const session=require('express-session')
const flash=require('connect-flash');
const passport=require('passport')
const passportLocal=require('passport-local')
const port=3000;

const {campSchema}=require('./schemas.js')
const {reviewSchema}=require('./schemas.js')
const campground=require('./models/campground.js')
const Review=require('./models/review.js')
const User=require('./models/user.js')


const campRoute=require('./routes/campgrounds.js')
const reviewRoute=require('./routes/reviews.js')
const userRoute=require('./routes/user.js')

const ExpressError=require('./utils/ExpressError.js')
const CatchAsyncError=require('./utils/CatchAsyncError.js');

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
app.use(express.static('public'))

const sessionConfig={
    secret:'thisshouldbeabettersecert',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+(1000*60*60*24*30),
        maxAge:Date.now()+(1000*60*60*24*30)
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user
    next()
})

//Routing paths
app.use('/',userRoute)
app.use('/campgrounds',campRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)

app.get('/',(req,res)=>{
    res.render('home');
})

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