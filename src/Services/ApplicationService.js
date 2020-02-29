
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

const DynamoAdapter = require('./Database/DynamoAdapter.js')

class ApplicationService {
  constructor(input) {
    //check applicationId
    this.applicationId = input;
  } 


  getApplicationInfo = (input, basic=false) => {
    this.input = input;
    return new Promise(async (resolve, reject) => {
      if (typeof this.applicationId === 'undefined' || this.applicationId<1){
        console.log(this.applicationId + " Not found")
        reject(new CustomErrors.NotFoundError('Not Found'));
      }

      let db = new DynamoAdapter;
      try{
        var response = await db.getApplication(this.applicationId);
      }
      catch (err){
        console.log (err);
      }
      console.log("getApplication result:" + JSON.stringify(response));

      //extract sub attributes
      this.declarations=response.declarations;

      if (basic){
        console.log("set basic to true");
        response.declarations=null;
      }
      resolve(response);
    })
  }

  setDeclarations = (input) => {
    this.setDeclarations = input;
    console.log('setDeclarations:'+input)
    let db = new DynamoAdapter;
    db.putDeclarations(this.applicationId, input);
  }

  static createApplication(input){
    var newApplication = new NewApplicationtModel(input);;
    newApplication.id='3';
    newApplication.createdDate= (new Date(Date.now())).toISOString();
    newApplication.status='DRAFT';

    let db = new DynamoAdapter;
    //DynamoAdapter.initializeTables();
    db.putApplication(newApplication);
    
    return;// new ApplicationService(newApplication.applicationId);
  }

  static initializeTables(input){
    DynamoAdapter.initializeTables();
    
    return;// new ApplicationService(newApplication.applicationId);
  }

}

module.exports = ApplicationService;
