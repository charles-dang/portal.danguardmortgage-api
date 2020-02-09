


/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Application management
 */



/**
 * @swagger
 * path:
 *  /application/:
 *    post:
 *      summary: Create a new loan application
 *      tags: [Application]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewApplicationItem'
 *      responses:
 *        "200":
 *          description: draft application object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/NewApplicationItemResponse'
 */

/**
 * @swagger
 * path:
 *  /application/applicant:
 *    post:
 *      summary: Add a new borrower to application
 *      tags: [Application]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewApplicantItem'
 *      responses:
 *        "200":
 *          description: draft application object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/NewApplicationItemResponse'
 *        "409":
 *          description: applicant's emal already exists for this application
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/ValidationResultItem'
 *        		
 */