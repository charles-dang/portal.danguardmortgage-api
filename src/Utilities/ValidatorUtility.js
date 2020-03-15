"use strict";
const CustomErrors = require('./CustomErrors');
/**
 * @swagger
 *  components:
 *    schemas:
 *      ValidationResultItem:
 *        type: object
 *        properties:
 *         key:
 *          type: string
 *         value:
 *          type: string
 *         validationRegex:
 *          type: string
 *         displayCode:
 *          type: string
 */          

class ValidationResultItem {
  constructor(key, value, validationRegex="", errorMessage="") {
    this.key = key;
    this.value = value;
    this.validationRegex = validationRegex;
    this.errorCode = "InvalidParameterException";
    this.errorMessage = errorMessage;
  }
}


class Validator{
	constructor(){
		this.IS_EMPTY = /.*\S.*/;
		this.IS_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.IS_NOT_BOOLEAN = /^true|false$/;
		this.IS_NOT_PHONE = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
		this.MARRIAGE_STATUS = ["SINGLE", "MARRIED", "JOINT_PARTNER", "DIVORCED"];
		this.EDUCATION_STATUS = ["HIGHSCHOOL", "SOME_COLLEGE", "GRADUATE_DEGREE", "UNKNOWN"];
		this.fileTypeList = ["INCOME","GOVERNMENT_ID", "BANK_STATEMENT", "MORTGAGE_DOCUMENT", "HOME_INSURANCE", "EMPLOYMENT", "UNEMPLOYMENT"];

	};

	isNullUndefined(item){
		if ((typeof item === 'undefined') || (item==null)){
			return "";
		}
	}

	isEmpty(item){
		if ((typeof item === 'undefined') || (item==null)){
			return this.IS_EMPTY+"";
		}
	    return this.regexValidate(item,this.IS_EMPTY);
	} 

	isEmail(item){
		return this.regexValidate(item,this.IS_EMAIL);
	}
	isPhone(item){
		return this.regexValidate(item, this.IS_NOT_PHONE);
	}
	isNotBoolean(item){
		return this.regexValidate(item, this.IS_NOT_BOOLEAN);
	}
	regexValidate(item, regex){
		var patt = new RegExp(regex);
	    if (patt.test(item)){
	    	return null
	    }
	    else{
	    	console.log(regex);
	    	return regex+"";
	    }
	}

	checkEducation(item){
		return this.isSubSet(item,this.EDUCATION_STATUS);
	}
	checkValidFileType(item){
		return this.isSubSet(item,this.fileTypeList);
	}
	checkMarriageStatus(item){
		return this.isSubSet(item,this.MARRIAGE_STATUS);		
	}
	isSubSet(item, set){
		if (typeof item === 'undefined'){
			return "Invalid selection.  Must be " + JSON.stringify(set); 
		}
		if (!set.includes(item.toUpperCase())){
			return "Invalid selection.  Must be " + JSON.stringify(set);
		}
		else{
			return null
		}		
	}
}

module.exports = {
	Validator:Validator, 
	ValidationResultItem:ValidationResultItem
}



