
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

class LoanModel
{	
	constructor(input){
		//validation of input
		let validationError = [];
		let result = validator.isEmpty(input.rate);
	    if (result){
      		validationError.push(new ValidationResultItem("rate", input.rate, result,"should not be empty"));
	    }

		result = validator.isEmpty(input.lockedDate);
	    if (result){
      		validationError.push(new ValidationResultItem("lockedDate", input.lockedDate, result,"should not be empty"));
	    }

		result = validator.isEmpty(input.lockedExpirationDate);
	    if (result){
      		validationError.push(new ValidationResultItem("lockedExpirationDate", input.lockedExpirationDate, result,"should not be empty"));
	    }

	    result = validator.isEmpty(input.processor);
	    if (result){
      		validationError.push(new ValidationResultItem("processor", input.processor, result,"should not be empty"));
	    }

	    //status passed
		if (validationError.length == 0 ){
			this.address1 = input.address1;
			this.address2 = input.address2;
			this.city = input.city;
			this.state = input.state;
			this.zipcode = input.zipcode;
			this.country = input.country;
			this.occupancyType = input.occupancyType;
			this.buildingType = input.buildingType;
			this.estimatedValue = input.estimatedValue;
		}
		else{
      		throw new CustomErrors.ValidationError(validationError);
		}
	}
}



module.exports = {
  LoanModel: LoanModel
  }