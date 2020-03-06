
var awsConfig=require('../../../config/AwsConfig.js');
var AWS = require("aws-sdk");
AWS.config.update({
  region: awsConfig.aws_local_config.region,
  endpoint: awsConfig.aws_local_config.endpoint,
  accessKeyId: awsConfig.aws_local_config.secretAccessKey,
  secretAccessKey: awsConfig.aws_local_config.secretAccessKey
});
const CustomErrors = require('../../Utilities/CustomErrors');
const DataBaseWriteError = CustomErrors.DataBaseWriteError;

class DynamoAdapter{
	constructor(){
		this.db = new AWS.DynamoDB.DocumentClient();
		this.applicationTable = 'tbl_loan_application';
		this.primaryKeyTable = 'tbl_primary_key';
		this.applicantTable = '';
	}
	
	putApplication = async function(info){
		let db = new AWS.DynamoDB.DocumentClient();
		console.log ('Revision='+info.revision);
		var lastRevision = info.revision;
		info.revision=lastRevision+1;
		var params={
	        TableName: this.applicationTable,
	        Item: info,
	        //ensure if update then revision has not changed since last read
	        //by checking revision
	        ConditionExpression:'revision= :revision OR attribute_not_exists(id)',
	        ExpressionAttributeValues: {
	        	':revision': lastRevision
	        }
	    };
	
	    let putResponse;
	    try{
	        putResponse = await db.put(params).promise();
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    }
	}

	/*
	postApplicationSubItem = async function(applicationId, subItem, info){
		console.log("putting SubItem:" + JSON.stringify(info));
		let db = new AWS.DynamoDB.DocumentClient();
		console.log ('Revision='+info.revision);
		var params={
	        TableName: this.applicationTable,
	        Key: {
	        	"id": applicationId
	        },
	        UpdateExpression: 'SET #subItem = list_append(#subItem, :value)',
	        ExpressionAttributeNames:{
	        	'#subItem': subItem
	        },
	        ExpressionAttributeValues: {
	        	':value': info
	        },
	        ReturnValues: 'NONE'
	    };
		console.log(JSON.stringify(params,0,2));
	    let putResponse;
	    try{
	        putResponse = await db.update(params).promise();
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    }
	}
	 */
	postApplicant = async function(applicationId,info){
		console.log("putting SubItem:" + JSON.stringify(info));
		let db = new AWS.DynamoDB.DocumentClient();
		console.log ('Revision='+info.revision);
		var params={
	        TableName: this.applicationTable,
	        Key: {
	        	"id": applicationId
	        },
	        UpdateExpression: 'SET applicants = list_append(applicants, :value)',
	        ExpressionAttributeValues: {
	        	':value': [info]
	        },
	        ReturnValues: 'UPDATED_NEW'
	    };
	
	    let putResponse;
	    try{
	        putResponse = await db.update(params).promise();
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    }
	}
	putProperty = async function(applicationId, info){
		console.log("putting Property:" + JSON.stringify(info,0,2));
			
	    let putResponse;
	    try{
	        putResponse = await this.putSingleAttribute(applicationId, 'property', info);
	    }
	    catch (err){
	    	throw (new DataBaseWriteError(err));
	    }
	    return putResponse;
	}

	putLoan = async function(applicationId, info){
		console.log("putting loan:" + JSON.stringify(info,0,2));
			
	    let putResponse;
	    try{
	        putResponse = await this.putSingleAttribute(applicationId, 'loan', info);
	    }
	    catch (err){
	    	throw (new DataBaseWriteError(err));
	    }
	    return putResponse;
	}

	putDeclarations = async function(applicationId,info){
		console.log("putting declarations:" + JSON.stringify(info,0,2));
			
	    let putResponse;
	    try{
	        putResponse = await this.putSingleAttribute(applicationId, 'declarations', info);
	    }
	    catch (err){
	    	throw (new DataBaseWriteError(err));
	    }
	    return putResponse;
	}

	putSingleAttribute = async function(applicationId, attributeName, info){
		let db = new AWS.DynamoDB.DocumentClient();
		let lastRevision = 0;
		if (typeof info.revision === 'undefined'){
			info.revision = 1;
			console.log("setting rivision to: "+ info.revision);
		}
		lastRevision =info.revision-1;
		var params={
	        TableName: this.applicationTable,
	        Key: {
	        	"id": applicationId
	        },
	        UpdateExpression: 'SET #attributeName = :value',
	        //ConditionExpression:'revision = :revision',
	        ExpressionAttributeNames:{
	        	'#attributeName': attributeName
	        },
	        ExpressionAttributeValues: {
	        	':value': info,
	        //	':revision': info.revision-1
	        },
	        ReturnValues: 'UPDATED_NEW'
	    };
		if (typeof info.revision === 'undefined'){
			//remove idempotency condition if no prev version
			params.ConditionExpression=null;
		}

		console.log("putSingleAttribute: "+JSON.stringify(params,0,2));
	    let putResponse;
	    try{
	        putResponse = await db.update(params).promise();
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    	throw (err);
	    }
	    console.debug("putSingleAttribute response:"+ JSON.stringify(putResponse,0,2));
	    return putResponse;
	}


	getApplication = async function(applicationId){
		this.applicationId=applicationId;
		console.log("TableName: " + this.applicationTable);
		return new Promise( async (resolve, reject) => {
			console.log("applicationId:"+this.applicationId);
			let db = new AWS.DynamoDB.DocumentClient();
			var params={
		        TableName: this.applicationTable,
		        Key: {
		            id: this.applicationId
		        }
		    }
		    try{
		    	console.log("getting data from DB");
		        var data = await db.get(params).promise();
		    	console.log("data result from DB: "+ JSON.stringify(data,0,2));
		        resolve(data.Item);
		    }
		    catch (err){
		    	reject(err);   
		    }
		});

	}

	static async getNextPrimaryKey(keyName){
		let db = new AWS.DynamoDB.DocumentClient();
		var params={
	        TableName: 'tbl_primary_key',
	        Key: {
	        	"key": keyName
	        },
	        UpdateExpression: 'SET id = id + :incr',
	        ExpressionAttributeValues: {
	        	':incr': 1
	        },
	        ReturnValues: 'UPDATED_NEW'
	    };
	
	    let putResponse;
	    try{
	        putResponse = await db.update(params).promise();
	        console.log(putResponse.Attributes.id);
	        return putResponse.Attributes.id;
	    }
	    catch (err){
	        console.error(" dynamodb.update(" + JSON.stringify(params) +").promise() result in error " + err);
	    }
	}

	static async initializeTables(){
		console.log ("Initialize "+ await this.getNextPrimaryKey('applicantId'));
		return;

		//LOAN APPLICANT TABLE
		var params = {
		    TableName : "tbl_loan_applicant",
		    KeySchema: [
		        { AttributeName: "id", KeyType: "HASH"},  //Partition key
			],
		    AttributeDefinitions: [
		        { AttributeName: "id", AttributeType: "S" },
			],
		    ProvisionedThroughput: {
		        ReadCapacityUnits: 5,
		        WriteCapacityUnits: 5
		    }	
		};

		console.log("attemping to create table.\n");
		let dynamodb = new AWS.DynamoDB();
		dynamodb.createTable(params, function(err, data) {
		    if (err) {
		        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
		    }
		});

		//LOAN APPLICATION TABLE
		var params = {
		    TableName : "tbl_loan_application",
		    KeySchema: [
		        { AttributeName: "id", KeyType: "HASH"},  //Partition key
			],
		    AttributeDefinitions: [
		        { AttributeName: "id", AttributeType: "S" },
			],
		    ProvisionedThroughput: {
		        ReadCapacityUnits: 5,
		        WriteCapacityUnits: 5
		    }	
		};

		console.log("attemping to create table.\n");
		dynamodb.createTable(params, function(err, data) {
		    if (err) {
		        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
		    }
		});

		//PRIMARY KEYS TABLE: Primary Keys
		params = {
		    TableName : "tbl_primary_key",
		    KeySchema: [
		        { AttributeName: "key", KeyType: "HASH"},  //Partition key
			],
		    AttributeDefinitions: [
		        { AttributeName: "key", AttributeType: "S" },
			],
		    ProvisionedThroughput: {
		        ReadCapacityUnits: 5,
		        WriteCapacityUnits: 5
		    }	
		};

		console.log("attemping to create table.\n");
		dynamodb.createTable(params, function(err, data) {
		    if (err) {
		        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
		    }
		});

		params = {
			TableName: "tbl_primary_key",
			Item: {'key':'applicantId', 'id':0}
		}
		let db = new AWS.DynamoDB.DocumentClient();
		try{
	        let putResponse = await db.put(params).promise();
	        console.log("set to 0")
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    }
		

	}

		
}



module.exports = DynamoAdapter;
