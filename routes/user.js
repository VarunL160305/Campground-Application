const express=require('express')
const router=express.Router({mergeParams:true})
const User=require('../models/user')
const asyncError=require('../utils/CatchAsyncError')
const passport=require('passport')

const {returnTo}=require('../middleware')

router.get('/register',(req,res)=>{
    res.render('users/register.ejs')
})

router.post('/register',asyncError(async(req,res,next)=>{
    try{
        const {email,username,password}=req.body
        const user=new User({email,username})
        const registeredUser=await User.register(user,password)
        req.login(registeredUser,function(err){
            if(err){
                next(err)
            }
            else{
                req.flash('success',"Welcome to campGrounds")
                res.redirect('/campgrounds')
            }
        })
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post('/login',returnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), async(req,res)=>{
    req.flash('success',"welcome back")
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){
            next(err)
        }
        else{
            req.flash('success',"Successfully Logged out")
            res.redirect('/campgrounds')
        }
    })
})

module.exports=router