
global.fetch = require('node-fetch');
global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const CustomErrors = require('../../Utilities/CustomErrors');

var awsConfig=require('../../../config/AwsConfig.js');
AWS.config.update({
  region: awsConfig.aws_local_config.region,
  endpoint: awsConfig.aws_local_config.endpoint,
  accessKeyId: awsConfig.aws_local_config.secretAccessKey,
  secretAccessKey: awsConfig.aws_local_config.secretAccessKey
});

const poolData = {    
	UserPoolId : "us-west-2_tyu7oO3de", // Your user pool id here    
	ClientId : "5n11aa5pg706e10833gelale5q" // Your client id here
}; 
const pool_region = 'us-west-2';

class CognitoAdapter{
	constructor(){
		this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	}

	registerUser = (info)=>{
		return new Promise( (resolve, reject) => {
		  	let attributes = [];
		    attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:info.email}));
		    attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:info.phone}));
		    attributes.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:"admin"}));

		    //Add user to user 
		  	this.userPool.signUp(info.email, 'SamplePassword123', attributes, null, function(error, result){
				if (error){
			        switch (error.code){
			          case 'UsernameExistsException':
			            var cognitoUser={username:info.email, pool: {userPoolId: poolData.UserPoolId}};
			            resolve(cognitoUser);
			            return;
			          case 'InvalidParameterException':
			            reject(new CustomErrors.ValidationError(error.message));
			            return;
			          default:
			            console.log("Unknown error.code: " + JSON.stringify(error,0,2));
			            reject(new CustomErrors.BaseError("Unknown Error with registerUser."));
			            return;
		        	}
		        }
		        else{
		        	resolve(result.user);
		        }
		    });
		}); //end of promise
	}//end of function
}


module.exports = CognitoAdapter;
