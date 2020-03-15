
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

const DynamoAdapter = require('./Adapters/DynamoAdapter.js')

class IdentityService {
  constructor(input) {
    //check applicationId
    this.email = input.email;
    this.phone = input.phone;
    this.firstName = input.firstName;
    this.lastName = input.lastName;

	//    
  }

}