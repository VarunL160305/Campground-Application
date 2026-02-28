const express=require('express')
const router=express.Router({mergeParams:true})
const User=require('../models/user')
const asyncError=require('../utils/CatchAsyncError')
const passport=require('passport')

const Users=require('../controllers/users')

const {returnTo}=require('../middleware')

router.get('/register',Users.renderRegister)

router.post('/register',asyncError(Users.registerUser))

router.get('/login',Users.renderLogin)

router.post('/login',returnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),Users.loginUser)

router.get('/logout',Users.logout)

module.exports=router