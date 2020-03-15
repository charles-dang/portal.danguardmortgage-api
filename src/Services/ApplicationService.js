
"use strict";

const NewApplicantModel = require('../Models/ApplicationModel.js').NewApplicantModel;
const NewApplicationtModel = require('../Models/ApplicationModel.js').NewApplicationtModel;

const CustomErrors = require('../Utilities/CustomErrors');

const DynamoAdapter = require('./Adapters/DynamoAdapter.js')
const MongoAdapter = require('./Adapters/MongoAdapter.js')
const UserAdapter = require('./Adapters/UserAdapter.js');
const BorrowerAdapter = require('./Adapters/BorrowerAdapter.js');
const NewUserModel = require('../Models/UserModel.js').NewUserModel;

class ApplicationService {
  constructor(input) {
    //check applicationId
    this.applicationId = input;
    this.borrowers=[];
    this.declarations={};

    this.db = new MongoAdapter();
  } 


  getApplicationInfo = (input, basic=false) => {
    this.input = input;
    return new Promise(async (resolve, reject) => {
      if (typeof this.applicationId === 'undefined' || this.applicationId<1){
        reject(new CustomErrors.NotFoundError('Not Found'));
      }

      try{
        var response = await this.db.getApplication(this.applicationId);
        this.revision=response.revision;
      }
      catch (err){
        console.log ("unable to load appliation from DB: "+err);
        reject(err);
      }
      console.log("getApplication response:" + JSON.stringify(response));

      if ((typeof response === 'undefined')){
        resolve(response);
      }
      else{
        //extract sub attributes
        this.declarations=response.declarations;
        this.borrowers = response.borrowers;

      }

      if (basic){
        console.log("set basic to true");
        response.declarations=null;
      }
      resolve(response);
    })
  }

  setDeclarations = (input) => {
    this.declarations = input;

    try{
      this.db.putDeclarations(this.applicationId, input);
    }
    catch(error){
      throw (error);
    }    
  }

  setProperty = async (input) => {
    this.property = input;
    console.log(JSON.stringify(input));
    try{
      this.property = await this.db.putProperty(this.applicationId, input);
    }
    catch (error){
      throw(error);
    }
  }

  setLoan = (input) => {
    this.loan = input;

    this.db.putLoan(this.applicationId, input);
  }
  
  addBorrower = async (applicationId,input) => {
    console.log("ApplicationService::addBorrower "+ JSON.stringify(input, 0,2));
    this.borrowers.push(input);
    input.version=0;

    //add entry to borrower table
    try{
      //console.log("Creating borrower record for: "+ JSON.stringify(input.email, 0,2));
      var borrowerId = await BorrowerAdapter.addBorrower(input);
    }
    catch (error){
      console.error(""+JSON.stringify(error,0,2))
      throw error; 
    }

    //add borrower to application
    input._id=borrowerId+"";
    try{
      var borrowerStatus = await this.db.putApplicationBorrower(this.applicationId, input);
    }
    catch( error){
      throw error;
    }
    
    //Add user
    var userInfo = new NewUserModel(input);
    userInfo.loan_applications=applicationId;
    try{
      var user = await UserAdapter.addUser(userInfo);
    }
    catch (error){
      console.log("Downstream service User returns ERROR for addUser with applicationId" + applicationId +":" + JSON.stringify(error, 0,2))
      throw error
    }

    return input;
  }

  static async createApplication(input){
    var newApplication = new NewApplicationtModel(input);;
    newApplication.createdDate= (new Date(Date.now())).toISOString();
    newApplication.status='DRAFT';

    let db = new MongoAdapter();
    let application = await db.putApplication(newApplication);
    return application;// new ApplicationService(newApplication.applicationId);
  }

  async getApplicationList(){
    try{
      var data = await this.db.getApplicationsList({});
    }
    catch(error){
      throw(error);
    }
    return data;

  }
}

module.exports = ApplicationService;
