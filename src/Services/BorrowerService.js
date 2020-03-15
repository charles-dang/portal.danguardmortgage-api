
"use strict";

global.fetch = require('node-fetch');
global.navigator = () => null;


const BorrowerModel = require('../Models/BorrowerModel.js').BorrowerModel;

const CustomErrors = require('../Utilities/CustomErrors');
const DynamoAdapter = require('./Adapters/DynamoAdapter.js')
const BorrowerMongoAdapter = require('./Adapters/BorrowerMongoAdapter.js')
const CognitoAdapter = require('./Adapters/CognitoAdapter.js')

class BorrowerService {
  constructor(input={}) {
    this.db = new BorrowerMongoAdapter();
  }

  addBorrower = async (info) =>{
    return new Promise(async (resolve, reject) => {     
      try{
        var data =  await this.db.addBorrower(info);
      }
      catch (error){
        reject(error);
      }    
      resolve(data);
    });
  }

  putBorrowerIncome = async (borrowerId, info) =>{
    return new Promise(async (resolve, reject) => {     
      try{
        var data =  await this.db.putBorrowerIncome(borrowerId, info);
      }
      catch (error){
        reject(error);
      }    
      resolve(data);
    });

  }
  putBorrowerLiability = async (borrowerId, info) =>{
    return new Promise(async (resolve, reject) => {     
      try{
        var data =  await this.db.putBorrowerLiability(borrowerId, info);
      }
      catch (error){
        reject(error);
      }    
      resolve(data);
    });

  }
  putBorrowerAsset = async (borrowerId, info) =>{
    return new Promise(async (resolve, reject) => {     
      try{
        var data =  await this.db.putBorrowerAsset(borrowerId, info);
      }
      catch (error){
        reject(error);
      }    
      resolve(data);
    });

  }
  /*
  updateBorrower = async (borrowerId, info) =>{
    return new Promise(async (resolve, reject) => {
      try{
        info.phone = "+1"+info.phone;
        var cognitoUser = await this.cognitoAdapter.registerUser(info);
      }
      catch (error){
        reject(error);
      }
      info.cognitoInfo = {'username':cognitoUser.username,'userPoolId':cognitoUser.pool.userPoolId};
      try{
        var data =  await this.db.putUser(info);
      }
      catch (error){
        reject(error);
      }    
      resolve(data);
    });
  }
  */
}


module.exports = BorrowerService;
