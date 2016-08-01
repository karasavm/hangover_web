
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
	}
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
	};

	$scope.addChoice = function(scope) {
		$scope.purchase.payments.push({ name: '', amount: 0 });
	};
}

function PurchaseNewCtrl($scope, $location, Purchase) {
	// Define an empty poll model object
	$scope.purchase = {
		title: '',
		payments: [ { name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }]
	};
	

	// Method to add an additional choice option
	$scope.addChoice = function(scope) {
		$scope.purchase.payments.push({ name: '', amount: 0 });
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

function MemberListCtrl($scope, $location, Member){

	$scope.members = Member.query();

	$scope.addMember = function() {
		$scope.members.push({ name: ''});
	};

	$scope.updateMembers = function() {
		
		members = $scope.members.filter(function(v){return v.name != ""});
		
		
		updateMembers = members.filter(function(v){return v._id})
		postMembers = members.filter(function(v){return !v._id})
		
		// add new members first
		for (var i =0; i< postMembers.length; i++){
			member = new Member(postMembers[i])

			member.$save(function(p, resp){
				if (!p.error){
					$location.path('purchases');
				} else {
					alert('Could not update member list')
				}
			})
			
		}

		// update existed members
		for (var i =0; i< updateMembers.length; i++){
			member = new Member(updateMembers[i])

			member.$update(function(p, resp){
				if (!p.error){
					$location.path('purchases');
				} else {
					alert('Could not update member list')
				}
			})
			
		}		
	}
}