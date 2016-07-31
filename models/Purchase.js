var mongoose = require('mongoose');

// Subdocument schema for votes
var voteSchema = new mongoose.Schema({ ip: 'String' });

// Subdocument schema for poll choices
var paymentSchema = new mongoose.Schema({ 
	name: String,
	amount: Number
	// votes: [voteSchema]
});

// Document schema for polls
exports.PurchaseSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	payments: [paymentSchema]
});