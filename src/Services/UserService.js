
"use strict";

global.fetch = require('node-fetch');
global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const UserModel = require('../Models/ApplicationModel.js').UserModel;

const CustomErrors = require('../Utilities/CustomErrors');
const DynamoAdapter = require('./Adapters/DynamoAdapter.js')
const MongoAdapter = require('./Adapters/MongoAdapter.js')
const CognitoAdapter = require('./Adapters/CognitoAdapter.js')

class UserService {
  constructor(input={}) {
    this.cognitoAdapter = new CognitoAdapter();
    this.db = new MongoAdapter();
  }

  registerUser = async (info) =>{
    return new Promise(async (resolve, reject) => {
      //console.log('registerUser:' + JSON.stringify(info,0,2))
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
}


module.exports = UserService;
