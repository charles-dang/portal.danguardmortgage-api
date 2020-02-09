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
    this.validationRegex = regex;
    this.dislayCode = dislayCode;
  }
}

