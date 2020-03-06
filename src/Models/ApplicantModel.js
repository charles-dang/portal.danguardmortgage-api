
"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;


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

class NewApplicantModel
{
  constructor(input){
    let validationError = [];
    this.borrower = {};
    this.coborrower = {};
    console.log("BORROWER:"+input.borrower);
    let result = validator.isEmpty(input.borrower);
    if (result){
      validationError.push(new ValidationResultItem("borrower", input.borrower, result,"should not be empty"));
    }
    else{
      let borrowerValidator = this.validateContactDetails(input.coborrower);
      validationError.concat(borrowerValidator);
    }

    console.log("CO-BORROWER:"+JSON.stringify(input.coborrower,0,2));
    let includeCoborrower = false;
    result = validator.isEmpty(input.coborrower);
    //if is not empty then validate sub fields
    if (!result){
      let coBorrowerValidator = this.validateContactDetails(input.coborrower);
      validationError.concat(coBorrowerValidator);
      includeCoborrower = true;
    }

    //validation passed
    if (validationError.length == 0 ){
      this.borrower.firstName=input.borrower.firstName;
      this.borrower.lastName=input.borrower.lastName;
      this.borrower.phone=input.borrower.phone;
      this.borrower.email=input.borrower.email;
      if (includeCoborrower){
        this.coborrower.firstName=input.coborrower.firstName;
        this.coborrower.lastName=input.coborrower.lastName;
        this.coborrower.phone=input.coborrower.phone;
        this.coborrower.email=input.coborrower.email;
      }
    }
    else{
      throw new CustomErrors.ValidationError(validationError);
    }
  }
  stringify = function(){
  	console.log(JSON.stringify(this));
  	return JSON.stringify(this);
  }

  validateContactDetails = function(details){
    let validationError = [];
    let result = validator.isEmpty(details.phone);
    //not required phone but if given then validate
    if (!result){
      result = validator.isEmpty(details.phone.type)
      if (result){
        validationError.push(new ValidationResultItem("phoneType", details.phone.type, result,"TBD"));
      }

      result = validator.isEmpty(details.phone.number)
      if (result){
        validationError.push(new ValidationResultItem("phoneNumber", details.phone.number, result,"TBD"));
      }

      result = validator.isEmpty(details.phone.type)
      if (result){
        validationError.push(new ValidationResultItem("isPrimary", details.phone.isPrimary, result,"TBD"));
      }
    }

    result = validator.isEmpty(details.email);
    if (result){
      validationError.push(new ValidationResultItem("email", details.email, result,"TBD"));
    }
    return validationError;
  }
}

class ApplicantModel extends NewApplicantModel
{
  constructor(info){
    super(info);
  }


}




module.exports = {
  NewApplicantModel: NewApplicantModel,
  ApplicantModel: ApplicantModel
}