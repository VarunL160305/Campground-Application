const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('users/register.ejs')
}

module.exports.registerUser=async(req,res,next)=>{
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
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login.ejs')
}

module.exports.loginUser=async(req,res)=>{
    req.flash('success',"welcome back")
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            next(err)
        }
        else{
            req.flash('success',"Successfully Logged out")
            res.redirect('/campgrounds')
        }
    })
}