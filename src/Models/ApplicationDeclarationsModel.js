
"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

class ApplicationDeclarationsModel
{

	constructor(input){

		this.ownershipPropertyType = null;
		this.ownershipPropertyInterest = null;
		this.titleHoldingStatus = null;
		this.isPrimaryResident = null;
		this.ownershipPropertyTitle = null;

		var validationError = [];

		let result = validator.isEmpty(input.ownershipPropertyType);
		if (result){
			validationError.push(new ValidationResultItem("ownershipPropertyType", input.ownershipPropertyType, result,"TBD"));
		}

		result = validator.isNotBoolean(input.ownershipPropertyInterest);
		if (result){
			validationError.push(new ValidationResultItem("ownershipPropertyInterest", input.ownershipPropertyInterest, result,"TBD"));
		}

		result = validator.isEmpty(input.titleHoldingStatus);
		if (result){
			validationError.push(new ValidationResultItem("titleHoldingStatus", input.titleHoldingStatus, result,"TBD"));
		}
		
		result = validator.isNotBoolean(input.isPrimaryResident);
		if (result){
			validationError.push(new ValidationResultItem("isPrimaryResident", input.isPrimaryResident, result,"TBD"));
		}
		
		result = validator.isEmpty(input.ownershipPropertyTitle);
		if (result){
			validationError.push(new ValidationResultItem("ownershipPropertyTitle", input.ownershipPropertyTitle, result,"TBD"));
		}

		//status passed, no error
		if (validationError.length == 0 ){
			this.ownershipPropertyType = input.ownershipPropertyType;
			this.ownershipPropertyInterest = input.ownershipPropertyInterest;
			this.titleHoldingStatus = input.titleHoldingStatus;
			this.isPrimaryResident = input.isPrimaryResident;
			this.ownershipPropertyTitle = input.ownershipPropertyTitle;
			this.revision = input.revision;
		}
		else{
      		throw new CustomErrors.ValidationError(validationError);
		}
	}

	stringify = function(){
		console.log(JSON.stringify(this));
		return JSON.stringify(this);
	}
}


module.exports = {
	ApplicationDeclarationsModel: ApplicationDeclarationsModel
}