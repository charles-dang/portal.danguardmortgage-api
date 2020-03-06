
"use strict";

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');


var awsConfig=require('../../../config/AwsConfig.js');
var AWS = require("aws-sdk");
AWS.config.update({
  region: awsConfig.aws_local_config.region,
  endpoint: awsConfig.aws_local_config.endpoint,
  accessKeyId: awsConfig.aws_local_config.secretAccessKey,
  secretAccessKey: awsConfig.aws_local_config.secretAccessKey
});

const UserModel = require('../Models/ApplicationModel.js').UserModel;

const CustomErrors = require('../Utilities/CustomErrors');
const DynamoAdapter = require('./Database/DynamoAdapter.js')

class UserService {
  constructor(input) {
    //check applicationId
    this.email = input.email;
    this.phone = input.phone;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
	//    
  }

}