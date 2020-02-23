
/**
 * @swagger
 *  components:
 *    schemas:
 *      ContactPerson:
 *        type: object
 *        properties:
 *          phone:
 *            type: string
 *          email:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      NewApplicantItem:
 *        type: object
 *        properties:
 *          borrower:
 *            $ref: '#/components/schemas/ContactPerson'
 *          coborrower:
 *            $ref: '#/components/schemas/ContactPerson'
 *        
 */

class NewApplicantModel
{
  constructor(input){
    var validationError = [];
    this.borrower = {};
    this.coborrower = {};

    //validation passed
    if (validationError.length == 0 ){
    	console.log(input.borrower)
        this.borrower=input.borrower;
        this.coborrower=input.coborrower;
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
  NewApplicationtModel: NewApplicationtModel,
  NewApplicantModel: NewApplicantModel
}