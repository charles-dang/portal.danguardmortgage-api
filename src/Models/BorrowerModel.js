
"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

const IncomeModel = require('./Borrower/IncomeModel.js');
const AssetModel = require('./Borrower/AssetModel.js');
const LiabilityModel = require('./Borrower/LiabilityModel.js');
const DocumentModel = require('./DocumentModel.js');

/**
 * @swagger
 *  components:
 *    schemas:
 *      ContactPerson:
 *        type: object
 *        properties:
 *          phone:
 *            type: string
 *          email:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      NewApplicantItem:
 *        type: object
 *        properties:
 *          borrower:
 *            $ref: '#/components/schemas/ContactPerson'
 *          coborrower:
 *            $ref: '#/components/schemas/ContactPerson'
 *        
 */

class NewBorrowerModel
{
  constructor(input){
    //initialize list attributes to empty array to enable addtoset functionality.
    //on update these fields must be delete to avoid overriding of existing entry
    this.accessPermissions=[];
    this.incomes=[];
    this.liabilities=[];
    this.assets=[];

    console.log("constructor::"+JSON.stringify(input,0,2));
    var validationError = [];

    let result = this.validateBorrowerDetails(input);
    validationError = validationError.concat(result);

    //console.log("CO-BORROWER:"+JSON.stringify(input.coborrower,0,2));
    let includeCoborrower = false;
    result = validator.isEmpty(input.loan_applications);
    if(result){
      validationError.push(new ValidationResultItem("loan_applications", input.loan_applications, result,"loan_applications is required."));      
    }
    //if is not empty then validate sub fields
    if (input.hasOwnProperty("coborrower")){
      let coBorrowerValidator = this.validateBorrowerDetails(input.coborrower);
      coBorrowerValidator.forEach ( (item) => {
        item.key = "coborrower."+item.key;
      });
      validationError=validationError.concat(coBorrowerValidator);
      includeCoborrower = true;
    }

    //validation passed
    if (validationError.length == 0 ){
      this.firstName=input.firstName;
      this.lastName=input.lastName;
      this.phone=input.phone;
      this.email=input.email;
      this.maritalStatus=input.maritalStatus;
      this.education=input.education;
      this.loan_applications=input.loan_applications;
      if (includeCoborrower){
        this.coborrower={};
        this.coborrower.firstName=input.coborrower.firstName;
        this.coborrower.lastName=input.coborrower.lastName;
        this.coborrower.phone=input.coborrower.phone;
        this.coborrower.email=input.coborrower.email;
        this.coborrower.maritalStatus=input.coborrower.maritalStatus;
        this.coborrower.education=input.coborrower.education;
      }
    }
    else{
      throw new CustomErrors.ValidationError(validationError);
    }
  }
  stringify = function(){
  	return JSON.stringify(this);
  }

  validateBorrowerDetails = function(details){
    let validationError = [];
    let result = validator.isPhone(details.phone);
    if (result){
      validationError.push(new ValidationResultItem("phone", details.phone, result,"Phone is required. 10 digit required"));
    }

    result = validator.isEmail(details.email);
    if (result){
      validationError.push(new ValidationResultItem("email", details.email, result,"Email is invalid or missing"));
    }

    console.log("===> validateBorrowerDetails"+JSON.stringify(validationError));
    return validationError;
  }
}

class BorrowerModel extends NewBorrowerModel
{
  constructor(info){
    super(info);
    var validationError = [];
    //remove sub object that was initialized in New Model to avoid accident override object attributes
    delete this.accessPermission;
    delete this.incomes;
    delete this.liabilities;
    delete this.assets;

    if (info.income){
      try{
        var income = new IncomeModel(info.income);
      }
      catch(error){

      }      
    }
    
    if (info.liabilities){
      try{
        var liabilities = new LiabilityModel(info.assets);
      }
      catch(error){

      }      
    }

    if (info.assets){
      try{
        var assets = new AssetModel(info.income);
      }
      catch(error){

      }      
    }

    if (info.accessPermissions){
      try{
        var accessPermissions = new IncomeModel(info.accessPermissions);
      }
      catch(error){

      }      
    }

  }

  validateBorrowerDetails = function(details){
    let validationError = [];
    let result = validator.isPhone(details.phone);
    if (result){
      validationError.push(new ValidationResultItem("phone", details.phone, result,"Phone is required. 10 digit required"));
    }

    result = validator.isEmail(details.email);
    if (result){
      validationError.push(new ValidationResultItem("email", details.email, result,"Email is invalid or missing"));
    }
    
    result = validator.checkMarriageStatus(details.marriageStatus)
    if (result){
      validationError.push(new ValidationResultItem("marriageStatus", details.marriageStatus, result,"marriageStatus is invalid or missing"));
    }

    result = validator.checkEducation(details.education)
    if (result){
      validationError.push(new ValidationResultItem("education", details.marriageStatus, result,"education is invalid or missing"));
    
    }
  }
}




module.exports = {
  NewBorrowerModel: NewBorrowerModel,
  BorrowerModel: BorrowerModel
}