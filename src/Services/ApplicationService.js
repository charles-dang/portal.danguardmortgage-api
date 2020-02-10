
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

class ApplicationService {
  constructor(input) {
    //check applicationId

  }

  static addApplication(input){
    var newApplication = input;
    newApplication.applicatinId='1';
    newApplication.createdDate= new Date(Date.now());
    newApplication.status='DRAFT'
    return newApplication;
  }

  addApplicant(input){
    //validate application exists

    //validate applicant info
    var newApplicant;
    try{
      newApplicantModel = new NewApplicantModel(input);
    }

    catch (error){
      throw error;
    }
    return newApplication;
  }
}




module.exports = ApplicationService;
