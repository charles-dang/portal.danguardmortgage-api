
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

const DynamoAdapter = require('./DynamoAdapter.js')

class ApplicationService {
  constructor(input) {
    //check applicationId
    this.applicationId = input;
  } 


  getApplicationInfo = () => {
    return new Promise(async (resolve, reject) => {
      if (typeof this.applicationId === 'undefined' || this.applicationId<1){
        console.log(this.applicationId + " Not found")
        reject('Not Found!');
      }

      let db = new DynamoAdapter;
      try{
        var response = await db.getApplication(this.applicationId);
      }
      catch (err){
        console.log (err);
      }
      console.log("getApplication result:" + JSON.stringify(response));
      resolve(response);
    })
  }


  static createApplication(input){
    var newApplication = new NewApplicationtModel(input);;
    newApplication.id='1';
    newApplication.createdDate= (new Date(Date.now())).toISOString();
    newApplication.status='DRAFT'

    let db = new DynamoAdapter;
    //DynamoAdapter.initializeTables();
    db.putApplication(newApplication);
    
    return;// new ApplicationService(newApplication.applicationId);
  }

}

module.exports = ApplicationService;
