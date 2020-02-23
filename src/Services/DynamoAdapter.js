
var awsConfig=require('../../config/AwsConfig.js');
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
		var params={
	        TableName: this.applicationTable,
	        Item: info
	    };

	    let putResponse;
	    try{
	        putResponse = await db.put(params).promise();
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
	static initializeTables(){
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
	}
}



module.exports = DynamoAdapter;
