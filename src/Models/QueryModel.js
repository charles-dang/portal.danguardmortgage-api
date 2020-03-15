
"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

class UserModel(){	
  constructor(input) {
    //
    //
	//validation of input
	let validationError = [];
	let result = validator.isEmail(input.email);

	if (validationError.length == 0){
	    this.email = input.email;
	    this.phone = input.phone;
	    this.firstName = input.firstName;
	    this.lastName = input.lastName;		
	}
	else{
  		throw new CustomErrors.ValidationError(validationError);
	}
	
  }
}



module.exports = {
  PropertyModel: PropertyModel
  }