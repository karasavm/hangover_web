// Controller for the poll list
function PollListCtrl($scope, Poll) {
	$scope.polls = Poll.query();
}

function PurchaseListCtrl($scope, Purchase) {

	$scope.purchases = Purchase.query();

	$scope.removePurchase = function(purchaseId){
		delPurchase = new Purchase({})
		delPurchase.$remove({purchaseId: purchaseId}, function(p, resp){
			if (!p.error){
				console.log("No error")
				$scope.purchases = $scope.purchases.filter(function(v) {return v._id != purchaseId})
			} else {
				alert('Could not delete purchase');
			}
		})
		
		// Purchase.remove({_id: "579e20937ce64dd01b61560f"},function(p, resp) {
		// 	if (!p.error){
		// 		console.log("done")
		// 	} else{
		// 		alert('Could not delete purchase');

		// 	}
		// })
	}
}

// Controller for an individual poll
function PollItemCtrl($scope, $routeParams, socket, Poll) {	
	$scope.poll = Poll.get({pollId: $routeParams.pollId});
	
	socket.on('myvote', function(data) {
		console.dir(data);
		if(data._id === $routeParams.pollId) {
			$scope.poll = data;
		}
	});
	
	socket.on('vote', function(data) {
		console.dir(data);
		if(data._id === $routeParams.pollId) {
			$scope.poll.choices = data.choices;
			$scope.poll.totalVotes = data.totalVotes;
		}		
	});
	
	$scope.vote = function() {
		var pollId = $scope.poll._id,
				choiceId = $scope.poll.userVote;
		
		if(choiceId) {
			var voteObj = { poll_id: pollId, choice: choiceId };
			socket.emit('send:vote', voteObj);
		} else {
			alert('You must select an option to vote for');
		}
	};
}

function PurchaseItemCtrl($scope, $routeParams, $location, socket, Purchase) {	
	
	$scope.purchase = Purchase.get({purchaseId: $routeParams.purchaseId});
	


	$scope.updatePurchase = function(){
		
		purchase = new Purchase($scope.purchase)
		
		Purchase.update({purchaseId: $routeParams.purchaseId}, $scope.purchase, function(p, resp){
			if (!p.error){
				$location.path('purchases');		
			} else {
				alert("Unable to Update purchase.")
			}
		})
		// var purchase = Purchase.get({purchaseId: $routeParams.purchaseId}, function(){
		// 	purchase.title = $scope.purchase.title;
		// 	purchase.payments = $scope.purchase.payments;
		// 	console.log(purchase)
		// 	purchase.$save(function(p, resp){
		// 		if (!p.error){
		// 			$location.path('purchases');		
		// 		} else {
		// 			alert("Unable to Update purchase.")
		// 		}
		// 	});
			
		// });

		// var newPurchase = new Purchase($scope.purchase);
				
		// // Call API to save poll to the database
		// newPurchase.$save(function(p, resp) {
		// 	if(!p.error) {
		// 		// If there is no error, redirect to the main view
		// 		$location.path('purchases');
		// 	} else {
		// 		alert('Could not create purchase');
		// 	}
		// });
	}
}

// Controller for creating a new poll
function PollNewCtrl($scope, $location, Poll) {

	// Define an empty poll model object
	$scope.poll = {
		question: '',
		choices: [ { text: '' }, { text: '' }, { text: '' }]
	};
	
	// Method to add an additional choice option
	$scope.addChoice = function() {

		$scope.poll.choices.push({ text: '' });
	};
	
	// Validate and save the new poll to the database
	$scope.createPoll = function() {
		$console.log("POOOOLLLLL")
		var poll = $scope.poll;
		
		// Check that a question was provided
		if(poll.question.length > 0) {
			var choiceCount = 0;
			
			// Loop through the choices, make sure at least two provided
			for(var i = 0, ln = poll.choices.length; i < ln; i++) {
				var choice = poll.choices[i];
				
				if(choice.text.length > 0) {
					choiceCount++
				}
			}
		
			if(choiceCount > 1) {
				// Create a new poll from the model
				var newPoll = new Poll(poll);
				
				// Call API to save poll to the database
				newPoll.$save(function(p, resp) {
					if(!p.error) {
						// If there is no error, redirect to the main view
						$location.path('polls');
					} else {
						alert('Could not create poll');
					}
				});
			} else {
				alert('You must enter at least two choices');
			}
		} else {
			alert('You must enter a question');
		}
	};
}


function PurchaseNewCtrl($scope, $location, Purchase) {
	// Define an empty poll model object
	$scope.purchase = {
		title: '',
		payments: [ { name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }]
	};
	

	// Method to add an additional choice option
	$scope.addChoice = function() {
		console.log("prim")
		$scope.purchase.payments.push({ name: '', amount: 0 });
		console.log("meta")
	};
	
	// Validate and save the new poll to the database
	$scope.createPoll = function() {
		var purchase = $scope.purchase;
		
		// Check that a question was provided
		if(purchase.title.length > 0) {
			var paymentCount = 0;
			
			// Loop through the choices, make sure at least two provided
			for(var i = 0, ln = purchase.payments.length; i < ln; i++) {
				var payment = purchase.payments[i];
				
				if(payment.name.length > 0) {
					paymentCount++
				}
			}
		
			if(paymentCount > 1) {
				// Create a new poll from the model
				var newPurchase = new Purchase(purchase);
				
				// Call API to save poll to the database
				newPurchase.$save(function(p, resp) {
					if(!p.error) {
						// If there is no error, redirect to the main view
						$location.path('purchase');
					} else {
						alert('Could not create purchase');
					}
				});
			} else {
				alert('You must enter at least two people.');
			}
		} else {
			alert('You must enter a title.');
		}
	};
}