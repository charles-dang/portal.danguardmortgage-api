
"use strict";

const express = require("express");
const router = express.Router();

const NewBorrowerModel = require('../Models/BorrowerModel.js').NewBorrowerModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;
const ApplicationDeclarationsModel = require('../Models/ApplicationDeclarationsModel.js').ApplicationDeclarationsModel;
const PropertyModel = require('../Models/PropertyModel.js').PropertyModel;
const LoanModel = require('../Models/PropertyModel.js').LoanModel;
const ApplicationService = require('../Services/ApplicationService.js');


const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Application management
 */

/**
 * @swagger
 * path:
 *  /application:
 *    post:
 *      summary: Create a new loan application
 *      tags: [Application]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewApplicationItem'
 *      responses:
 *        "200":
 *          description: draft application object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/NewApplicationItemResponse'
 *        "422":
 *         	description: invalid param
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/ValidationResultItem'
 */
router.post("/application", async (req, res, next) => {
	console.log("ENTRY")
	//perform input validation
	var newApplication;
	try{
		newApplication = new NewApplicationtModel(req.body);
	}
	catch (error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}

	//write to DB
	var application;
	try{
		application = await ApplicationService.createApplication(newApplication);
	}
	catch(error){  //unhandled exeption
		CustomErrors.respondHttpErrors(res,error);
		return;
	}

	res.json(application);
});

router.get("/applications", async (req, res, next) => {
	console.log("Got application list", req.query);
	try{
		let newApplication = new ApplicationService(req.body);
		var data = await newApplication.getApplicationList(req.query);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
	}
	res.send(data)
});

/**
 * [description]
 * @param  {[type]} "/application/:id" [description]
 * @param  {[type]} async              (req,         res, next [description]
 * @return {[type]}                    [description]
 */
router.get("/application/:id", async (req, res, next)=>{
	var appModel;
	console.log("retrieving applicationId: " + req.params.id);
	let applicationService = new ApplicationService(req.params.id);
	try{
		appModel = await applicationService.getApplicationInfo();
	}
	catch (err){
		CustomErrors.respondHttpErrors(res,err);
	}
	console.log(JSON.stringify(appModel, 0,2));
	res.send(appModel);
});

/**
 * @swagger
 * path:
 *  /application/{applicationId}/submission:
 *    post:
 *      summary: Add a new borrower to application
 *      tags: [Application]
 *      parameters:
 *        - in: path
 *          name: applicationId
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewApplicantItem'
 *      responses:
 *        "200":
 *          description: draft application object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/NewApplicationItemResponse'
 *        "409":
 *          description: applicant's emal already exists for this application
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/ValidationResultItem'
 *        		
 */

router.post("/application/:id/borrower", async (req, res, next) => {
	console.log ("RECEIVED POST http:// - /application/:id/borrower");
	try {
		let request = req.body;
		request.loan_applications=req.params.id;
		var borrower = new NewBorrowerModel(request);
	}
	catch (error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	try{
		var applicationService = new ApplicationService(req.params.id);
	} 
	catch(err){
		CustomErrors.respondHttpErrors(res,err);
	}
	try{
		var appModel = await applicationService.addBorrower(req.params.id,borrower);
	}
	catch (err){
		CustomErrors.respondHttpErrors(res,err);
	}
	res.send(appModel);
});

router.put("/application/:id/property", async (req, res,next) =>{
	let property = null;
	try{
		property = new PropertyModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}
	let applicationService;
	try{
		applicationService = new ApplicationService(req.params.id);
	} 
	catch(err){
		CustomErrors.respondHttpErrors(res,err);
		return;
	}
	try{
		var appModel = await applicationService.setProperty(property);
	}
	catch (err){
		CustomErrors.respondHttpErrors(res,err);
	}

	res.send(property);
});

router.put("/application/:id/loan", async (req, res,next) =>{
	let loan = null;
	try{
		loan = new LoanModel(req.body);
	}
	catch(error){
		CustomErrors.respondHttpErrors(res,error);
		throw error;
	}

	let applicationService;
	try{
		applicationService = new ApplicationService(req.params.id);
	} 
	catch(err){
		CustomErrors.respondHttpErrors(res,err);
		return;
	}
	try{
		var appModel = await applicationService.setLoan(property);
	}
	catch (err){
		CustomErrors.respondHttpErrors(res,err);
	}

	res.send(property);
});

router.put("/application/:id/declarations", async (req, res, next)=>{
	let declarations=null;
	try{
		declarations = new ApplicationDeclarationsModel(req.body);
	} 
	catch (error){
		CustomErrors.respondHttpErrors(res,error);
		throw error;
	}
	
	let applicationService;
	try{
		applicationService = new ApplicationService(req.params.id);
	} 
	catch(err){
		if (error instanceof CustomErrors.ValidationError) {
	  		res.status(422).send(error.message);
	  		return;
		} 
	}
	try{
		var appModel = await applicationService.setDeclarations(declarations);
	}
	catch (err){
		CustomErrors.respondHttpErrors(res,err);
	}
	console.log(JSON.stringify(appModel, 0,2));
	res.send(appModel);
});

router.post("/application/initializeDB", (req, res, next)=>{
	ApplicationService.initializeTables();
	res.send('Table initialized!');
});


module.exports = router;