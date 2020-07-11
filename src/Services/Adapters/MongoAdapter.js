
//Mongo connection
var MongoClient = require('mongodb').MongoClient;  
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var db;
// Connection URL
// Create the db connection
MongoClient.connect(url, function(err, conn) {  
    //assert.equal(null, err);
    	if (err){
    		console.log("Database Connection error===>"+JSON.stringify(err,0,2));
    	}
    	else{
    		db=conn.db("DanguardRealty");
    		console.log("successfully connected.");
    	}
    }
);

const CustomErrors = require('../../Utilities/CustomErrors');
const DataBaseWriteError = CustomErrors.DataBaseWriteError;

class MongoAdapter{
	constructor(){
		this.applicationTable = 'tbl_loan_application';
		this.primaryKeyTable = 'tbl_primary_key';
		this.userTable = 'tbl_user';
	}
	
	putApplication = async function(info){
		try{
			var data = await db.collection(this.applicationTable).insertOne(info);
		}
		catch (err){
			console.log("putApplication ERR"+err);
			return err;
		}
		return data.ops[0];	}

	putApplicationBorrower = async function(applicationId,info){
		//console.log("db:putApplicationBorrower:" + JSON.stringify(info));
		//console.log ('Revision='+info.revision);

		//building filter query
		var queryAndConsitions = [];
		if (typeof applicationId !== 'undefined'){
			queryAndConsitions.push({'_id':ObjectID(applicationId)});			
		}
		if (typeof info.email !=='undefined'){
			queryAndConsitions.push({'borrowers.email':{$ne:info.email}});	
		}
		var query = {$and : queryAndConsitions};
		var update={}

		//build array update object
		Object.keys(info).forEach(function(key){
			update["borrowers.$."+key]=info[key];
		});

		try{
			var data = await db.collection(this.applicationTable).updateOne({'_id':ObjectID(applicationId), 'borrowers.email':info.email},{$set: update},{'returnOriginal':false});
			if (data.result.n == 0){ 
				data = await db.collection(this.applicationTable).updateOne({'_id':ObjectID(applicationId)},{$addToSet: {'borrowers':info}},{'returnOriginal':false,upsert:true});
			}		
		}
		catch (error){
			console.log("putUser ERROR:" + JSON.stringify(error,0,2));
			throw (new CustomErrors.DataBaseWriteError(error));
		}
		//console.log("db:putApplicationBorrower>>>:" + JSON.stringify(data,0,2));
	};
	putProperty = async function(applicationId, info){
		//console.log("putting Property:" + JSON.stringify(info,0,2));
			
	    try{
	        var putResponse = await this.putSingleAttribute(applicationId, 'property', info);
	    }
	    catch (error){
	    	throw (new DataBaseWriteError(error));
	    }
	    return putResponse;
	}

	putLoan = async function(applicationId, info){
	    let putResponse;
	    try{
	        putResponse = await this.putSingleAttribute(applicationId, 'loan', info);
	    }
	    catch (error){
	    	throw (new DataBaseWriteError(error));
	    }
	    return putResponse;
	}

	putDeclarations = async function(applicationId,info){
		//console.log("putting mongodb declarations:" + JSON.stringify(info,0,2));
			
	    try{
	        var data = await this.putSingleAttribute(applicationId, 'declarations', info);
	    }
	    catch (error){
	    	throw (new DataBaseWriteError(error));
	    }
	    return data;
	}

	putSingleAttribute = async function(applicationId, attributeName, info){
		let lastRevision = 0;
		if (typeof info.revision === 'undefined'){
			info.revision = 1;
			console.log("setting revision to: "+ info.revision);
		}
		lastRevision =info.revision-1;
		var updateInfo={};
		updateInfo[attributeName]=info
		//console.log("Update " + this.applicationTable +attributeName +" of application Id: "+ applicationId);
		try{
			var data = await db.collection(this.applicationTable).updateOne({'_id':ObjectID(applicationId)}, {$set: updateInfo});	
		}
		catch (error){
			console.log("putSingleAttribute ERROR: "+JSON.stringify(error));
			throw (new DataBaseWriteError(error));
		}
		//console.log("putSingleAttribute", JSON.stringify(data));
	    return data;
	}


	getApplication = async function(applicationId){
		try{
			var data = await db.collection(this.applicationTable).findOne({'_id':ObjectID(applicationId)});
			console.log(data);
		}
		catch(error){
			console.log("db:getApplication ERROR: "+JSON.stringify(error));
			throw (new DataBaseWriteError(error));
		}
		return data;

	}

	getApplicationsList = async function(options){
		console.log("Finding Charles");

		var queryNameConditions = [];

	    if (options.identityId){
	      console.log("query.identityId=" + options.identityId);
	    }

	    if (options.stage){
	      console.log("query.identityId=" + options.stage);
	    }
	    if (options.name){
	    	var arNames = options.name.split(' ');

	    	if (arNames.length > 1){
				queryNameConditions.push({'borrowers.firstName': arNames[0], 'borrowers.lastName': arNames[1]});
				queryNameConditions.push({'borrowers.firstName': arNames[1], 'borrowers.lastName': arNames[0]});
				queryNameConditions.push({'borrowers.coborrower.firstName': arNames[0], 'borrowers.coborrower.lastName': arNames[1]});
				queryNameConditions.push({'borrowers.coborrower.firstName': arNames[1], 'borrowers.coborrower.lastName': arNames[0]});
	    	}
	    	else{
				queryNameConditions.push({'borrowers.firstName': arNames[0]});
				queryNameConditions.push({'borrowers.lastName': arNames[0]});
				queryNameConditions.push({'borrowers.coborrower.firstName': arNames[0]});
				queryNameConditions.push({'borrowers.coborrower.lastName': arNames[0]});
	    	}    
	    }
	    

		var queryAndConsitions=[];
		if (queryNameConditions.length > 0){
			queryAndConsitions.push({$or : queryNameConditions});
		}
		queryAndConsitions.push({status : {$in:['DRAFT']}});

		var query = {$and : queryAndConsitions};
		var limit = Math.min(2,2);
		console.log("db:getApplicationsList query: "+JSON.stringify(query));

		try{
			var data = await db.collection(this.applicationTable).find(query).collation( {locale: 'en', strength: 2 } ).limit(limit).toArray();
		}
		catch(error){
			console.log(error);
			throw (new DataBaseReadError(err));
		}
		return data;
	}
	postIntoTable = async function(tableName, info){

	}

	//this function perform upsert with two possible keys to match:
	//_id and email
	putUser = async function(info, overrideArrayAttributes=null){
		//building filter query
		var queryAndConsitions = [];
		if (typeof info._id !== 'undefined'){
			queryAndConsitions.push({'_id':ObjectID(info._id)});			
		}
		else if (typeof info.email !=='undefined'){
			queryAndConsitions.push({'email':info.email});	
		}
		var query = {$and : queryAndConsitions};
		var update={}

		//convert attributes that contains array
		if (info.loan_applications){
			update.$addToSet={loan_applications : info.loan_applications};
			delete info.loan_applications;
		}


		update.$set=info;
		try{
			var data = await db.collection(this.userTable).findOneAndUpdate(query,update,{upsert:true});
		}
		catch (error){
			console.log("putUser ERROR:" + JSON.stringify(error,0,2));
			throw (new CustomErrors.DataBaseWriteError(error));
		}

	    if (data.lastErrorObject.updatedExisting){
	        return data.value._id;
	    }
	    else{
	        return data.lastErrorObject.upserted;
	    }
	};
		
}



module.exports = MongoAdapter;
