const express =require("express")
const searchUserController =require('../controler/searchUserController.js')
const protectRoute=require('../middelware/protectRoute.js')

const searchRoute=express.Router();

searchRoute.get('/user',protectRoute,searchUserController)
module.exports=searchRoute