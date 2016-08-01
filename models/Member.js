var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({ 
	name: {type: String, required: true, unique: true}	
	// email: String
});

// Document schema for polls
// exports.MemberSchema = new mongoose.Schema({
// 	members: [memberSchema]
// });

exports.MemberSchema = memberSchema