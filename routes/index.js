// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
	if (process.env.DB_NAME){
 		db = mongoose.createConnection('localhost', process.env.DB_NAME);
	} else {
		db = mongoose.createConnection('localhost', 'pollsapp');
	}
}

// Get Poll schema and model
var PollSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', PollSchema);

var PurchaseSchema = require('../models/Purchase.js').PurchaseSchema;
var Purchase = db.model('purchases', PurchaseSchema);

var MemberSchema = require('../models/Member.js').MemberSchema
var Member = db.model('members', MemberSchema);

// Main application view
exports.index = function(req, res) {
	res.render('index');
};

// JSON API for list of polls
exports.list = function(req, res) {
	// Query Mongo for polls, just get back the question text
	Poll.find({}, 'question', function(error, polls) {
		res.json(polls);
	});	
};
exports.listP = function(req, res) {
	// Query Mongo for polls, just get back the question text
	Purchase.find({}, function(error, purchases) {
		res.json(purchases);
	});
};

// JSON API for getting a single poll
exports.poll = function(req, res) {
	// Poll ID comes in the URL
	var pollId = req.params.id;
	
	// Find the poll by its ID, use lean as we won't be changing it
	Poll.findById(pollId, '', { lean: true }, function(err, poll) {
		if(poll) {
			var userVoted = false,
					userChoice,
					totalVotes = 0;

			// Loop through poll choices to determine if user has voted
			// on this poll, and if so, what they selected
			for(c in poll.choices) {
				var choice = poll.choices[c]; 

				for(v in choice.votes) {
					var vote = choice.votes[v];
					totalVotes++;

					if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
						userVoted = true;
						userChoice = { _id: choice._id, text: choice.text };
					}
				}
			}

			// Attach info about user's past voting on this poll
			poll.userVoted = userVoted;
			poll.userChoice = userChoice;

			poll.totalVotes = totalVotes;
		
			res.json(poll);
		} else {
			res.json({error:true});
		}
	});
};

exports.purchase = function(req, res) {
	// Poll ID comes in the URL
	var purchaseId = req.params.id;
	
	// Find the poll by its ID, use lean as we won't be changing it
	Purchase.findById(purchaseId, '', { lean: true }, function(err, purchase) {
		if(purchase) {
			res.json(purchase);
		} else {
			res.json({error:true});
		}
	});
};

// JSON API for creating a new poll
exports.create = function(req, res) {
	console.log(req.body)
	var reqBody = req.body,
			// Filter out choices with empty text
			choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
			// Build up poll object to save
			pollObj = {question: reqBody.question, choices: choices};
				
	// Create poll model from built up poll object
	var poll = new Poll(pollObj);
	
	// Save poll to DB
	poll.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});
};

exports.createP = function(req, res, next) {
	
	// console.log("request BODY")
	// console.log(req.body)
	var reqBody = req.body,
			// Filter out choices with empty text
			payments = reqBody.payments.filter(function(v) { return v.name != ''; }),
			// Build up poll object to save
			purchaseObj = {title: reqBody.title, payments: payments};
	
	// Create poll model from built up poll object
	var purchase = new Purchase(purchaseObj);
	
	console.log(purchaseObj)
	// Save poll to DB
	purchase.save(function(err, doc) {
		if(err || !doc) {
			next(err)
		} else {
			res.json(doc);
		}		
	});
};

exports.updateP = function(req, res, next){
	console.log("EFTASE UPDATE")
	console.log(req.body)

	Purchase.update({_id: req.params.id}, req.body, function(err, purchase){
		if (err){
			console.log(err)
			return next(err)
		} else{
			console.log(purchase)
			res.json(purchase)
		}
		console.log(purchase)
	})
};
exports.deleteP = function(req, res, next){
	
	Purchase.remove({_id: req.params.id}, function(err){
		if (err){
			console.log(err)
			return next(err)
		} else{
			res.json({message: "ok"})
		}
		
	})
};

exports.listMember = function(req, res, next){
	Member.find(function(err, members){
		if (err){
			return next(err)
		}
		res.json(members)
	})
};
exports.createMember = function(req, res, next){

	console.log("CREATEEEEEEEE")
	// Create poll model from built up poll object
	var member = new Member({
		name: req.body.name
	});
	
	console.log(member)
	// Save poll to DB
	member.save(function(err, doc) {
		if(err) {
			return next(err)
		} else {
			res.json(doc);
		}		
	});
};

exports.updateMember = function(req, res, next){
	console.log(req.body)
	Member.update({_id: req.body._id}, req.body, function(err, data){
		if (err) {
			return next(err);
		}
		res.json({message: "ok"})	
	})
	
}

exports.deleteMember = function(req, res, next){
	
	console.log(req.query._id)
	Member.remove({_id: req.query._id}, function(err){
		if (err){
			console.log(err)
			return next(err)
		} else{
			res.json({message: "ok"})
		}
		
	})
	
}
