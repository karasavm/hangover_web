var mongoose = require('mongoose');


// Subdocument schema for poll choices
var transferSchema = new mongoose.Schema({ 
	from: String,
	to: String,
	amount: Number
	// votes: [voteSchema]
});



// Document schema for polls
exports.transferSchema = transferSchema;