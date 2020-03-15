"use strict";

const CustomErrors = require('../../Utilities/CustomErrors');
const Validator = require('../../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();
const crypto = require("crypto");
var ObjectID = require('mongodb').ObjectID;


const ValidationResultItem = require('../../Utilities/ValidatorUtility').ValidationResultItem;


class NewAssetModel{
	constructor(input){

		if (typeof input._id === 'undefined'){
			input._id = ObjectID(crypto.randomBytes(12).toString("hex"));
		}

		var validationError = [];

		let result = validator.isEmpty(input.borrowerType);
		if (result){
			validationError.push(new ValidationResultItem("borrowerType", input.borrowerType, result, "Invalid Borrower Type: [Borrower, Coborrower]"));
		}

		result = validator.isEmpty(input.type);
		if (result){
			validationError.push(new ValidationResultItem("type", input.type, result,"Invalid Asset Type.  "));
		}

		result = validator.isEmpty(input.value);
		if (result){
			validationError.push(new ValidationResultItem("value", input.type, result,"Invalid Value.  "));
		}

		result = validator.isEmpty(input.unit);
		if (result){
			validationError.push(new ValidationResultItem("unit", input.unit, result,"Invalid Asset Unit.  "));
		}

		//status passed
		if (validationError.length == 0 ){
			this._id = input._id;
			this.borrowerType = borrowerType;
			this.type = type;
			this.value = input.value;
			this.unit = input.unit;
			this.notes = input.notes;
		}
		else{
      		throw new CustomErrors.ValidationError(validationError);
		}			
	}
}

class AssetModel extends NewAssetModel{
	constructor(info){
    	super(info);
	}
}
module.exports = {
	NewAssetModel: NewAssetModel,
	AssetModel: AssetModel
}

