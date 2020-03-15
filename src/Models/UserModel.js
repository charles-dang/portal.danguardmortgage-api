
"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

class NewUserModel{	
  constructor(input) {
    //
    //
	//validation of input
	let validationError = [];
	let result = validator.isEmail(input.email);
	if (result){
		validationError.push(new ValidationResultItem("email", input.email, result,"incorrect email format"));
	}
	result = validator.isEmpty(input.firstName);
	if (result){
		validationError.push(new ValidationResultItem("firstName", input.firstName, result,"should not be empty"));
	}
	result = validator.isEmpty(input.lastName);
	if (result){
		validationError.push(new ValidationResultItem("lastName", input.lastName, result,"should not be empty"));
	}
	result = validator.isPhone(input.phone);
	if (result){
		validationError.push(new ValidationResultItem("phone", input.phone, result,"Invalid phone format. 800-0000-0000 or 8000000000"));
	}

	if (validationError.length == 0){
	    this.email = input.email;
	    this.phone = input.phone;
	    this.firstName = input.firstName;
	    this.lastName = input.lastName;		
	    this.loan_applications = input.loan_applications
	}
	else{
  		throw new CustomErrors.ValidationError(validationError);
	}
	
  }
}

class UserModel{
	constructor(userId){
		this.userId = userId;
	};

	static async addUser(input){

	} 
}


module.exports = {
  NewUserModel: NewUserModel,
  UserModel: UserModel
}