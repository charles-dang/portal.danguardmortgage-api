
"use strict";

const express = require("express");
const router = express.Router();

const NewBorrowerModel = require('../Models/BorrowerModel.js').NewBorrowerModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;
const ApplicationDeclarationsModel = require('../Models/ApplicationDeclarationsModel.js').ApplicationDeclarationsModel;
const PropertyModel = require('../Models/PropertyModel.js').PropertyModel;
const LoanModel = require('../Models/PropertyModel.js').LoanModel;

const BorrowerService = require('../Services/BorrowerService.js');
const BorrowerModel = require('../Models/BorrowerModel.js').BorrowerModel;
const IncomeModel = require('../Models/Borrower/IncomeModel.js').IncomeModel;
const LiabilityModel = require('../Models/Borrower/LiabilityModel.js').LiabilityModel;
const AssetModel = require('../Models/Borrower/IncomeModel.js').AssetModel;

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;


router.put("/borrower", async (req, res,next) =>{
	//build and validate input
	//console.log("Received HTTP PUT request: /borrower: " + JSON.stringify(req.body,0,2));
	try{
		var userInfo = new BorrowerModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	let borrowerService = new BorrowerService()
	try{
		var user = await borrowerService.addBorrower(userInfo);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
	}
	res.send(user);
});


router.put("/borrower/:id/income", async (req, res,next) =>{
	//build and validate input         
	//console.log("Received HTTP PUT request: /borrower/income: " + JSON.stringify(req.body,0,2));
	try{
		var incomeInfo = new IncomeModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	let borrowerService = new BorrowerService()
	try{
		var income = await borrowerService.putBorrowerIncome(req.params.id,incomeInfo);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	res.send(incomeInfo);
});

router.put("/borrower/:id/asset", async (req, res,next) =>{
	//build and validate input         
	//console.log("Received HTTP PUT request: /borrower/income: " + JSON.stringify(req.body,0,2));
	try{
		var assetInfo = new AssetModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	let borrowerService = new BorrowerService()
	try{
		var income = await borrowerService.putBorrowerAsset(req.params.id,assetInfo);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	res.send(assetInfo);
});

router.put("/borrower/:id/liability", async (req, res,next) =>{
	//build and validate input         
	//console.log("Received HTTP PUT request: /borrower/liability: " + JSON.stringify(req.body,0,2));
	try{
		var liabilityInfo = new LiabilityModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	let borrowerService = new BorrowerService()
	try{
		var liability = await borrowerService.putBorrowerLiability(req.params.id,liabilityInfo);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	res.send(liabilityInfo);
});



module.exports = router;