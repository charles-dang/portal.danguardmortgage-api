
"use strict";

const express = require("express");
const router = express.Router();

const NewBorrowerModel = require('../Models/BorrowerModel.js').NewBorrowerModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;
const ApplicationDeclarationsModel = require('../Models/ApplicationDeclarationsModel.js').ApplicationDeclarationsModel;
const PropertyModel = require('../Models/PropertyModel.js').PropertyModel;
const LoanModel = require('../Models/PropertyModel.js').LoanModel;

const UserService = require('../Services/UserService.js');
const NewUserModel = require('../Models/UserModel.js').NewUserModel;



const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;


router.post("/user", async (req, res,next) =>{
	console.log("receive user put"+JSON.stringify(req.body,0,2));
	//build and validate input
	try{
		var userInfo = new NewUserModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}

	let userService = new UserService();
	try{
		var user = await userService.registerUser(userInfo);
	}
	catch(error){
		console.error("userService.registerUser(userInfo)")
		CustomErrors.respondHttpErrors(res,error);
	}
	//var user = userService.registerUser({'email':Math.random()+"email@amisrarl.com", 'phone':'+17148109443'});
	res.send(user);
});



module.exports = router;