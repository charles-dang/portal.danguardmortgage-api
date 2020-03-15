"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;

class DocumentModel {
	constructor(input){
		input.notes = [];
		var validationError = [];

		let result = validator.isEmpty(input.applicantId);

		result = validator.isEmpty(input.applicationId);
		if (result){
			validationError.push(new ValidationResultItem("loanId", input.loanId, result,"TBD"));
		}

		result = validator.isEmpty(input.documentType);
		if (result){
			validationError.push(new ValidationResultItem("documentType", input.documentType, result,"TBD"));
		}

		result = validator.isEmpty(input.documentFormat);
		if (result){
			validationError.push(new ValidationResultItem("documentFormat", input.documentFormat, result,"TBD"));
		}

		result = validator.isEmpty(input.fileName);
		if (result){
			validationError.push(new ValidationResultItem("fileName", input.documentFormat, result,"TBD"));
		}
		result = validator.isEmpty(input.fullURL);
		if (result){
			validationError.push(new ValidationResultItem("fullURL", input.documentFormat, result,"TBD"));
		}

		result = validator.isEmpty(input.requestId);
		if (result){
			validationError.push(new ValidationResultItem("requestId", input.documentFormat, result,"TBD"));
		}

		result = validator.isEmpty(input.notes);
		if (result){
			validationError.push(new ValidationResultItem("notes", input.documentFormat, result,"TBD"));
		}

		//status passed
		if (validationError.length == 0 ){
			this.applicationId
			this.documentFormat=input.documentFormat;
			this.documentType=input.documentType;
			this.fileName=input.fileName;
			this.fullURL=input.fullURL;
			this.requestId=input.requestId;
			this.notes.push(input.notes);
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
	DocumentModel: DocumentModel
}