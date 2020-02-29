
var awsConfig=require('../../../config/AwsConfig.js');
var AWS = require("aws-sdk");
AWS.config.update({
  region: awsConfig.aws_local_config.region,
  endpoint: awsConfig.aws_local_config.endpoint,
  accessKeyId: awsConfig.aws_local_config.secretAccessKey,
  secretAccessKey: awsConfig.aws_local_config.secretAccessKey
});


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

	putDeclarations = async function(applicationId,info){
		console.log("putting Declarations:" + JSON.stringify(info));
		let db = new AWS.DynamoDB.DocumentClient();
		console.log ('Revision='+info.revision);
		//var lastRevision = info.revision;
		//info.revision=lastRevision+1;
		var params={
	        TableName: this.applicationTable,
	        Key: {
	        	"id": applicationId
	        },
	        AttributeUpdates: {
	        	'declarations':{
	        		Action: 'PUT',
	        		Value: info
	        	}
	        },
	        //ExpressionAttributeValues: {
	        //	':declarations': JSON.stringify(info)
	        //},
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
		    	console.log("data result from DB: "+ data);
		        resolve(data.Item);
		    }
		    catch (err){
		    	reject(err);   
		    }
		});

	}

	static async getNextPrimaryKey(tableName){
		let db = new AWS.DynamoDB.DocumentClient();
		var params={
	        TableName: 'tbl_primary_key',
	        Key: {
	        	"table_name": tableName
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
		console.log ("Initialize "+ await this.getNextPrimaryKey('tbl_loan_application'));
		return;
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
		let dynamodb = new AWS.DynamoDB();
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
		        { AttributeName: "table_name", KeyType: "HASH"},  //Partition key
			],
		    AttributeDefinitions: [
		        { AttributeName: "table_name", AttributeType: "S" },
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
			Item: {'table_name':'tbl_loan_application', 'id':0}
		}
		let db = new AWS.DynamoDB.DocumentClient();
		try{
	        let putResponse = await db.put(params).promise();
	        console.log("set to 0")
	    }
	    catch (err){
	        console.error(" dynamodb.put(" + JSON.stringify(params) +").promise() result in error " + err);
	    }

	}ƒ
}



module.exports = DynamoAdapter;
