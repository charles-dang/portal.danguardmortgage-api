"use strict";

const CustomErrors = require('../../Utilities/CustomErrors');
const Validator = require('../../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const crypto = require("crypto");
var ObjectID = require('mongodb').ObjectID;


const ValidationResultItem = require('../../Utilities/ValidatorUtility').ValidationResultItem;


class LiabilityModel{
	constructor(input){

		if (typeof input._id === 'undefined'){
			input._id = ObjectID(crypto.randomBytes(12).toString("hex"));
		}

		var validationError = [];

		let result = validator.isEmpty(input.borrowerType);
		if (result){
			validationError.push(new ValidationResultItem("borrowerType", input.borrowerType, result, "Invalid Borrower Type: [Borrower, Coborrower]"));
		}

		result = validator.isEmpty(input.isCosigner);
		if (result){
			validationError.push(new ValidationResultItem("type", input.isCosigner, result,"Invalid Liability Type.  "));
		}

		result = validator.isEmpty(input.type);
		if (result){
			validationError.push(new ValidationResultItem("type", input.type, result,"Invalid Liability Type.  "));
		}

		result = validator.isEmpty(input.accountNumber);
		if (result){
			validationError.push(new ValidationResultItem("value", input.accountNumber, result,"Invalid Value.  "));
		}

		result = validator.isEmpty(input.monthlyPayment);
		if (result){
			validationError.push(new ValidationResultItem("unit", input.monthlyPayment, result,"Invalid Liability Unit.  "));
		}

		result = validator.isEmpty(input.currentBalance);
		if (result){
			validationError.push(new ValidationResultItem("unit", input.currentBalance, result,"Invalid Liability Unit.  "));
		}

		//status passed
		if (validationError.length == 0 ){
			this._id = input._id;
			this.type = input.type;
			this.accountNumber = input.accountNumber;
			this.monthlyPayment = input.monthlyPayment;
			this.currentBalance = input.currentBalance;
			this.isCosigner = input.isCosigner;
		}
		else{
      		throw new CustomErrors.ValidationError(validationError);
		}			
	}
}


module.exports = {
	LiabilityModel: LiabilityModel
}

