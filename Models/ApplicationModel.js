


/**
 * @swagger
 *  components:
 *    schemas:
 *      NewApplicationItem:
 *       type: object
 *       properties:
 *        referralId:
 *         description: "UserId of referral User"
 *         type: string
 *        referralCode:
 *         description: "Referral code that as used"
 *         type: string
 *        identityId:
 *         description: "Id of the user that created this loan -- usually referred as userId"
 *         type: number
 *        loanType:
 *         type: string
 *         enum: [PURCHASE, REFINANCE, REFINANCE_CASHOUT, HELOC]
 *        amortizationType:
 *         type: string
 *         enum: [ADJUSTABLE_RATE, FIXED_RATE, GEM, GPM, OTHER]
 *        loanTerms:
 *         type: string
 *         enum : [ 30_YEAR, 15_YEAR,10_YEAR,5_YEAR]
 *        createdDate:
 *          type: string
 *        status:
 *         type: string
 *         
 *      NewApplicationItemResponse:
 *        type: object
 *        allOf:
 *          - properties:
 *             appicationId:
 *              type: string
 *          - $ref: '#/components/schemas/NewApplicationItem'
 */          