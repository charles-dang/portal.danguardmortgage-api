
"use strict";

const express = require("express");
const router = express.Router();

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;
const ApplicationService = require('../Services/ApplicationService.js');


const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

var awsConfig=require('../../config/AwsConfig.js');
var AWS = require("aws-sdk");
AWS.config.update({
  region: awsConfig.aws_local_config.region,
  endpoint: awsConfig.aws_local_config.endpoint,
  accessKeyId: awsConfig.aws_local_config.secretAccessKey,
  secretAccessKey: awsConfig.aws_local_config.secretAccessKey
});
var dynamodb = new AWS.DynamoDB();

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
	
	//perform input validation
	var newApplication;
	try{
		newApplication = new NewApplicationtModel(req.body);
	}
	catch (error){
		CustomErrors.respondHttpErrors(res,error);
		return;
	}

	console.log("create application to DB");
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

/**
 * @swagger
 * path:
 *  /application/{applicationId}/applicant:
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
router.post("/application/:applicationId/applicant", (req, res, next) => {

  //perform input validation
  var newApplication;
  try{
  	newApplication = new NewApplicationtModel(req.body);
  }
  catch (error){
  	if (error instanceof CustomErrors.ValidationError) {
  		res.status(422).send(error.message);
  		return;
	} 
	else {
		console.log('Unknown error', error);
		throw error;
	}
  }

  console.log("adding applicant to application");
  //write to DB
  var application;
  try{
  	application = ApplicationService.addApplication(newApplication);
  }
  catch(error){  //unhandled exeption
  	next(error);
  	return;
  }
  
  res.json(application);
});

router.get("/application/:id", async (req, res, next)=>{
	console.log("retrieving applicationId: " + req.params.id);
	let applicationService = new ApplicationService(req.params.id);
	try{
		var appModel = await applicationService.getApplicationInfo();
	}
	catch (err){
		res.status(404);
		res.send("unknown Id");
	}
	console.log(JSON.stringify(appModel, 0,2));
	res.send(appModel);
});

router.post("/application/initializeDB", (req, res, next)=>{
	ApplicationService.initializeTables();
	res.send('Table initialized!');
});


module.exports = router;