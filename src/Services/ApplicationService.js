
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

const DynamoAdapter = require('./Database/DynamoAdapter.js')

class ApplicationService {
  constructor(input) {
    //check applicationId
    this.applicationId = input;
    this.applicants=[];
    this.declarations={};
  } 


  getApplicationInfo = (input, basic=false) => {
    this.input = input;
    return new Promise(async (resolve, reject) => {
      if (typeof this.applicationId === 'undefined' || this.applicationId<1){
        console.log(this.applicationId + " Not found")
        reject(new CustomErrors.NotFoundError('Not Found'));
      }

      let db = new DynamoAdapter;
      var response;
      try{
        response = await db.getApplication(this.applicationId);
        this.revision=response.revision;
        console.log("====> "+response.revision);
      }
      catch (err){
        console.log ("unable to load appliation from DB: "+err);
        reject(err);
      }
      console.log("getApplication response:" + JSON.stringify(response));

      if ((typeof response === 'undefined')){
        resolve(response);
      }
      else{
        //extract sub attributes
        this.declarations=response.declarations;
        this.applicants = response.applicants;

      }

      if (basic){
        console.log("set basic to true");
        response.declarations=null;
      }
      resolve(response);
    })
  }

  setDeclarations = (input) => {
    this.declarations = input;

    let db = new DynamoAdapter;
    try{
      db.putDeclarations(this.applicationId, input);
    }
    catch(error){
      throw (error);
    }    
  }

  setProperty = async (input) => {
    this.property = input;
    let db = new DynamoAdapter;
    console.log(JSON.stringify(input));
    try{
      this.property = await db.putProperty(this.applicationId, input);
    }
    catch (error){
      throw(error);
    }
  }

  setLoan = (input) => {
    this.loan = input;

    let db = new DynamoAdapter;
    console.log(JSON.stringify(input));
    db.putLoan(this.applicationId, input);
  }
  
  addApplicant = async (input) => {
    this.applicants.push(input);
    input.version=0;
    input.id =     await DynamoAdapter.getNextPrimaryKey('applicantId')+"";
    let db = new DynamoAdapter;
    db.postApplicant(this.applicationId, input);
  }

  static async createApplication(input){
    var newApplication = new NewApplicationtModel(input);;
    newApplication.id=await DynamoAdapter.getNextPrimaryKey('applicationId')+"";
    newApplication.createdDate= (new Date(Date.now())).toISOString();
    newApplication.status='DRAFT';

    let db = new DynamoAdapter;
    //DynamoAdapter.initializeTables();
    db.putApplication(newApplication);
    console.log("newApplication.id"+newApplication.id);
    return;// new ApplicationService(newApplication.applicationId);
  }

  static initializeTables(input){
    DynamoAdapter.initializeTables();
    
    return;// new ApplicationService(newApplication.applicationId);
  }

}

module.exports = ApplicationService;
