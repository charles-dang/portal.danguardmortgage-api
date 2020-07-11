"use strict";

const CustomErrors = require('../../Utilities/CustomErrors');
const request = require('request');

var options = {
	host: process.env["USER_SERVICE_HOST"] || 'http://localhost',
	port: process.env["USER_SERVICE_PORT"] || 3000,
	headers: {
	'Content-Type': 'application/json'
	}
}

var userServiceUrl =  options.host +":"+options.port+"/api/v1"

var UserAdapter = {
	addUser : async function(info){
		//console.log("in addUser Adapter"+options.host)

		var params = options;
		params.method = 'POST';
		params.path='/api/v1/user';
		try{
			var data = await UserAdapter.httpRequest(params, JSON.stringify(info));
		}
		catch(error){
			console.error("UserAdapter::addUser "+ JSON.stringify(error,0,2));
			throw (new CustomErrors.HttpDownStreamError('UserAdapter::addUser'))
		}
		return data;
	},

	httpRequest : async function (params, postData) {
		//console.log("in httpRequest:\n"+JSON.stringify(postData) );
		params.headers= {
		'Content-Type': 'application/json'
		}
		//console.log("params: "+ JSON.stringify(params,0,2))
	    return new Promise(function(resolve, reject) {
	        request.post({
	        	headers: {'content-type' : 'application/json'},
			 	url: userServiceUrl+"/user",
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


module.exports = UserAdapter;