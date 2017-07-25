"use strict";

//globals
var userSchema = require("../../model/userSchema");
var Log = require("../../appUtil/logger");
var statics = require("../../appUtil/appStatic");
var debug = require("debug")("userControl");
var userProfile = require("../../model/userProfileSchema");

//constants
var userObj = {};
var componentName = "controller.user.userControl";

/**
 * [login description]
 * @param  {[type]} params [description]
 * @param  {[type]} callb  [description]
 * @return {[type]}        [description]
 */
userObj.login = function(params, callb){
	var error = {};
	var query = {
		username: params.username,
		pass: params.pass
	};
	var subComp = ".login";
	var logId = params.logId;

	userSchema.find(query, function(err, result){
		if(err){
			error.msg 		= statics.commonError.serverErr.displayMsg;
			error.status 	= statics.commonError.serverErr.status;
			error.code 		= statics.commonError.serverErr.code;
			error.logId 	= logId;
			error.err 		= err;

			Log.error(componentName + subComp, logId, err);
			return callb(error);
		}

		if(!result || result.length < 1){
			error.msg 		= statics.commonError.unAuthenticate.displayMsg;
			error.status 	= statics.commonError.unAuthenticate.status;
			error.code 		= statics.commonError.unAuthenticate.code;
			error.logId 	= logId;
			error.err 		= "no record found or wrong loginToken" + JSON.stringify(query);

			Log.error(componentName + subComp, logId, error);
			return callb(error);
		}

		if(result[0] && result[0].isEnabled != 1){
			error.msg 		= statics.commonError[statics.usrStatus[result[0].isEnabled]].displayMsg
			error.status 	= statics.commonError[statics.usrStatus[result[0].isEnabled]].status;
			error.code 		= statics.commonError[statics.usrStatus[result[0].isEnabled]].code;
			error.logId 	= logId;
			error.err 		= "not eligible user for this action" + JSON.stringify(query);
			
			Log.error(componentName + subComp, logId, error);
			return callb(error);
		}

		Log.info(componentName + subComp, logId, result);

		var logInData = {
			username: result[0].username,
			loginToken: result[0].loginToken,
			isEnabled: result[0].isEnabled,
			profId: result[0].profId
		};

		return callb(null, logInData);
	});
};

userObj.logout = function(params, callb){
	var error = {};
	var query = {
		username: params.username,
		loginToken: params.loginToken
	};
	var subComp = ".logout";
	var logId = params.logId;

	userSchema.find(query, function(err, result){
		if(err){
			error.msg 		= statics.commonError.serverErr.displayMsg;
			error.status 	= statics.commonError.serverErr.status;
			error.code 		= statics.commonError.serverErr.code;
			error.err 		= err;
			error.logId 	= logId;

			Log.error(componentName + subComp + "#1", logId, err);
			return callb(error);
		}

		if(!result || result.length < 1){
			error.msg 		= statics.commonError.unAuthenticate.displayMsg;
			error.status 	= statics.commonError.unAuthenticate.status;
			error.code 		= statics.commonError.unAuthenticate.code;
			error.logId 	= logId;
			error.err 		= "no record found or wrong loginToken" + JSON.stringify(query);

			Log.error(componentName + subComp + "#2", logId, error);
			return callb(error);
		}

		if(result[0] && result[0].isEnabled != 1){
			error.msg 		= statics.commonError[statics.usrStatus[result[0].isEnabled]].displayMsg
			error.status 	= statics.commonError[statics.usrStatus[result[0].isEnabled]].status;
			error.code 		= statics.commonError[statics.usrStatus[result[0].isEnabled]].code;
			error.logId 	= logId;
			error.err 		= "not eligible user for this action" + JSON.stringify(query);
			
			Log.error(componentName + subComp + "#3", logId, error);
			return callb(error);
		}

		Log.info(componentName + subComp + "#4", logId, result);

		var logInData = {
			loginToken: result[0].loginToken,
		};

		return callb(null, logInData);
	});
};

/**
 * [registration description]
 * @param  {[type]} params [description]
 * @param  {[type]} callb  [description]
 * @return {[type]}        [description]
 */
userObj.registration = function(params, callb){
};

/**
 * [getProfile description]
 * @param  {[type]} params [description]
 * @param  {[type]} callb  [description]
 * @return {[type]}        [description]
 */
userObj.getProfile = function(params, callb){
	var error = {};
	var query = {
		profId: params.username
	};
	var subComp = ".getProfile";
	var logId = params.logId;

	userProfile.find(query, function(err, res){
		if(err){
			error.msg 		= statics.commonError.serverErr.displayMsg;
			error.status 	= statics.commonError.serverErr.status;
			error.code 		= statics.commonError.serverErr.code;
			error.logId 	= logId;
			error.err 		= err;

			Log.error(componentName + subComp, logId, err);
			return callb(error);
		}

		if(!res || res.length < 1){
			error.msg 		= statics.commonError.unAuthenticate.displayMsg;
			error.status 	= statics.commonError.unAuthenticate.status;
			error.code 		= statics.commonError.unAuthenticate.code;
			error.logId 	= logId;
			error.err 		= "no record found or wrong loginToken" + JSON.stringify(query);

			Log.error(componentName + subComp, logId, error);
			return callb(error);
		}

		return callb(null, res);

	});
};

module.exports = userObj;

(function(){
	if(require.main == module){
		var params = {
			"username": "test@test.com",
			"pass": "123",
			"logId": "tg6fghdsdsdfok9eudhieu"
		};

		userObj.login(params, function(err, rust){
			console.log(err, rust);
			//process.exit(0);
		});
	}
}());