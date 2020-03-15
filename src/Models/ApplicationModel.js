"use strict";

const CustomErrors = require('../Utilities/CustomErrors');
const Validator = require('../Utilities/ValidatorUtility.js').Validator;
var validator = new Validator();

const ValidationResultItem = require('../Utilities/ValidatorUtility').ValidationResultItem;
const ApplicationDeclarationsModel = require('./ApplicationDeclarationsModel').ApplicationDeclarationsModel;


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
	borrowers =[];
	constructor(input){
		var validationError = [];

		let result = validator.isEmpty(input.referralCode);
		if (result){
			validationError.push(new ValidationResultItem("referralCode", input.referralCode, result,"TBD"));
		}

		result = validator.isEmpty(input.identityId);
		if (result){
			validationError.push(new ValidationResultItem("identityId", input.identityId, result,"TBD"));
		}

		if (typeof input.declarations === 'undefined'){
			input.declarations = {};
		}
		else{
			try{
				var declarations = new ApplicationDeclarationsModel(input.declarations);
			}
			catch(error){
				error.message.forEach ( (item) => {
					item.key = "declarations"+item.key;
				});
				validationError.push(error.message);
			}

		}

		//status passed
		if (validationError.length == 0 ){
			this.declarations = declarations;
			this.referralId = input.referralId;
			this.referralCode = input.referralCode;
			this.identityId = input.identityId;
			this.loanType = input.loanType;
			this.amortizationType = input.amortizationType;
			this.loanTerms = input.loanTerms;
			this.revision = 0;
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


class ApplicationModel extends NewApplicationtModel{
	constructor(input){
		//new application
		if (typeof input.applicationId === 'undefined'){
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


