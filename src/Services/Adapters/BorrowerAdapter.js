"use strict";

const CustomErrors = require('../../Utilities/CustomErrors');
const request = require('request');

var options = {
	host: process.env["BsORROWER_SERVICE_HOST"],
	port: process.env["BORROWER_SERVICE_PORT"],
	headers: {
	'Content-Type': 'application/json'
	}
}

var borrowerServiceUrl = process.env["BORROWER_SERVICE_HOST"]+":"+process.env["BORROWER_SERVICE_PORT"]+"/api/v1"

var BorrowerAdapter = {
	addBorrower : async function(info){
		//console.log("in addBorrower Adapter"+options.host+":"+options.port+JSON.stringify(info));
		var params = options;
		params.method = 'PUT';
		params.path='/api/v1/borrower';
		try{
			var data = await BorrowerAdapter.httpRequest(params, JSON.stringify(info));
		}
		catch(error){
			console.error("BorrowerAdapter::addBorrower \n"+ JSON.stringify(error,0,2));
			throw (new CustomErrors.HttpDownStreamError('BorrowerAdapter::addBorrower'))
		}
		return data.body;
	},

	httpRequest : async function (params, postData) {
		console.log("in httpRequest:\n"+JSON.stringify(postData) );
		params.headers= {
		'Content-Type': 'application/json'
		}
		//console.log("params: "+ JSON.stringify(params,0,2))
	    return new Promise(function(resolve, reject) {
	        request.put({
	        	headers: {'content-type' : 'application/json'},
			 	url: borrowerServiceUrl+"/borrower",
			 	body: postData 
				}, function(error, response, body){
					if (error){
						console.log(error);
						reject(error);
					}
					else{
						resolve(response);
					}
				});
	    });
	}
}


module.exports = BorrowerAdapter;