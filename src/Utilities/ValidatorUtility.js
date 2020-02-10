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
  constructor(key, value, validationRegex="", dislayCode="") {
    this.key = key;
    this.value = value;
    this.validationRegex = validationRegex;
    this.dislayCode = dislayCode;
  }
}


class Validator{
	constructor(){
		this.IS_EMPTY = /.*\S.*/;
		this.IS_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
	    return this.regexValidate(item,this.IS_EMPTY)
	} 

	isEmail(item){
		return this.regexValidate(item,this.IS_EMAIL)
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
}

module.exports = {
	Validator:Validator, 
	ValidationResultItem:ValidationResultItem
}



