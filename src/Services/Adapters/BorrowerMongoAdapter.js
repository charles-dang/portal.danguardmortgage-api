
//Mongo connection
var MongoClient = require('mongodb').MongoClient;  
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var db;
// Connection URL
var url = 'mongodb+srv://portal-api:2x1OXzsTfRLg4znu@cluster0-k21aw.mongodb.net/test?retryWrites=true&w=majority';
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
		this.borrowerTable = 'tbl_borrower';
	}

	//this function perform upsert with two possible keys to match:
	//_id and email
	addBorrower = async function(info, overrideArrayAttributes=null){
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
			var data = await db.collection(this.borrowerTable).findOneAndUpdate(query,update,{upsert:true});
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


	putBorrowerIncome = async function(borrowerId, info){
		console.log("db:putBorrowerIncome:" + JSON.stringify(info));
		console.log ('Revision='+info.revision);

		var update={}

		//build array update object
		Object.keys(info).forEach(function(key){
			update["incomes.$."+key]=info[key];
		});

		try{
			var data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId), 'incomes._id':info._id},{$set: update},{'returnOriginal':false});
			if (data.result.n == 0){ 
				data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId)},{$addToSet: {'incomes':info}},{'returnOriginal':false,upsert:true});
			}		
		}
		catch (error){
			throw (new CustomErrors.DataBaseWriteError(error));
		}

	};

	putBorrowerLiability = async function(borrowerId, info){
		console.log("db:putBorrowerIncome:" + JSON.stringify(info));
		console.log ('Revision='+info.revision);

		var update={}

		//build array update object
		Object.keys(info).forEach(function(key){
			update["liabilities.$."+key]=info[key];
		});

		try{
			var data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId), 'liabilities._id':info._id},{$set: update},{'returnOriginal':false});
			if (data.result.n == 0){ 
				data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId)},{$addToSet: {'liabilities':info}},{'returnOriginal':false,upsert:true});
			}		
		}
		catch (error){
			throw (new CustomErrors.DataBaseWriteError(error));
		}

	};


	putBorrowerAsset = async function(borrowerId, info){
		var update={}
		//build array update object
		Object.keys(info).forEach(function(key){
			update["assets.$."+key]=info[key];
		});

		try{
			var data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId), 'assets._id':info._id},{$set: update},{'returnOriginal':false});
			if (data.result.n == 0){ 
				data = await db.collection(this.borrowerTable).updateOne({'_id':ObjectID(borrowerId)},{$addToSet: {'assets':info}},{'returnOriginal':false,upsert:true});
			}		
		}
		catch (error){
			throw (new CustomErrors.DataBaseWriteError(error));
		}
	};
}




module.exports = MongoAdapter;
