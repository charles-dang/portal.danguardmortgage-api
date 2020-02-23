"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;



/**
 * @swagger
 *  components:
 *    schemas:
 *      NewApplicationItem:
 *        type: object
 *        properties:
 *         referralId:
 *           description: "UserId of referral User"
 *           type: string
 *         referralCode:
 *           description: "Referral code that as used"
 *           type: string
 *         identityId:
 *           description: "Id of the user that created this loan -- usually referred as userId"
 *           type: number
 *         loanType:
 *           type: string
 *           enum: [PURCHASE, REFINANCE, REFINANCE_CASHOUT, HELOC]
 *         amortizationType:
 *           type: string
 *           enum: [ADJUSTABLE_RATE, FIXED_RATE, GEM, GPM, OTHER]
 *         loanTerms:
 *           type: string
 *           enum : [ 30_YEAR, 15_YEAR,10_YEAR,5_YEAR]
 *         createdDate:
 *           type: string
 *         status:
 *          type: string
 *         
 *      NewApplicationItemResponse:
 *        type: object
 *        allOf:
 *          - properties:
 *             appicationId:
 *              type: string
 *          - $ref: '#/components/schemas/NewApplicationItem'
 */     

class NewApplicationtModel
{
	referralCode = null;
	identityId = null;
	loanType = null;
	amortizationType = null;
	loanTerms = null;

	constructor(input){
		var validationError = [];

		let referralCodeResult = validator.isEmpty(input.referralCode);
		if (referralCodeResult){
			validationError.push(new ValidationResultItem("referralCode", input.referralCode, referralCodeResult,"TBD"));
		}

		let identityIdResult = validator.isEmpty(input.identityId);
		if (identityIdResult){
			validationError.push(new ValidationResultItem("identityId", input.identityId, identityIdResult,"TBD"));
		}

		//status passed
		if (validationError.length == 0 ){
			this.referralId = input.referralId;
			this.referralCode = input.referralCode;
			this.identityId = input.identityId;
			this.loanType = input.loanType;
			this.amortizationType = input.amortizationType;
			this.loanTerms = input.loanTerms;
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


class ApplicationModel{
	constructor(input){
		//new application
		if (typeof input.applicationId === 'undefined'){
			let newApplicant = new NewApplicantModel(input);
		}
		else{

		}
	}
	static addNew(input){
		let newApplication = new NewApplicationtModel(input);
	}
}


module.exports = {
	NewApplicationtModel: NewApplicationtModel
}


