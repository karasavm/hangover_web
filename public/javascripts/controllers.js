
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

function PurchaseItemCtrl($scope, $routeParams, $location, Purchase, Member) {	
	
	$scope.purchase = Purchase.get({purchaseId: $routeParams.purchaseId});
	
	// console.log($scope.purchase)

	$scope.updatePurchase = function(){
		
		purchase = $scope.purchase
		console.log(purchase)
		if(purchase.title.length > 0) {
		// 	// Loop through the choices, make sure at least two 
			if (purchase.payments.length >= 2){

				zeroPayments = 0
				for (var i=0; i< purchase.payments.length;i++){
					if ((purchase.payments[i].amount == 0) || (purchase.payments[i].amount=='') || (purchase.payments[i].amount==null)){
						purchase.payments[i].amount = 0
						zeroPayments += 1;
					}
				}

				if (zeroPayments<purchase.payments.length){

					var newPurchase = new Purchase(purchase);
					Purchase.update({purchaseId: $routeParams.purchaseId}, $scope.purchase, function(p, resp){
						if (!p.error){
							$location.path('purchases');		
						} else {
							alert("Could not Update purchase.")
						}
					})

				}else{
					for (var i=0; i< purchase.payments.length;i++){
						if (purchase.payments[i].amount == 0){
							purchase.payments[i].amount = ''
						}
					}
					alert('You must enter at least one non zero amount.');
				}
			} else {
				alert('You must enter at least two people.');
			}
		} else {
			alert('You must enter a title.');
		}

	};

	$scope.addRestMembers = function(){
		members = Member.query(function(data){

			for (var i=0; i<members.length;i++){
				found = false
				for (var j=0;j<$scope.purchase.payments.length;j++){
					if (members[i].name == $scope.purchase.payments[j].name){
						found = true
						break
					}
				}
				if (!found){
					$scope.purchase.payments.push({name: members[i].name, amount: ''})
				}
			}
		})
	}

	$scope.removePayment = function(name){
		$scope.purchase.payments = $scope.purchase.payments.filter(function(v){return v.name!=name})
	}
	
}

function PurchaseNewCtrl($scope, $location, Purchase, Member) {
	// Define an empty poll model object
	
	var initialPayments = function(){
		var payments = [];
		members = Member.query(function(data){
			for (var i=0; i < members.length;i++){
				payments.push({name: members[i].name, amount: ''})
			}		
		})
		return payments;
	}
	
	$scope.purchase = {
		title: '',
		payments: initialPayments()
	};
	
	$scope.resetPayments = function(){
		$scope.purchase.payments = initialPayments()
	}

	$scope.removePayment = function(name){
		$scope.purchase.payments = $scope.purchase.payments.filter(function(v){return v.name!=name})
	}
	// Method to add an additional choice option
	$scope.addChoice = function(scope) {
		$scope.purchase.payments.push({ name: '', amount: 0 });
	};
	
	// Validate and save the new poll to the database
	$scope.createPurchase = function() {
		var purchase = $scope.purchase;
		
		// Check that a question was provided

		if(purchase.title.length > 0) {
		// 	// Loop through the choices, make sure at least two 
			if (purchase.payments.length >= 2){

				zeroPayments = 0
				for (var i=0; i< purchase.payments.length;i++){
					if ((purchase.payments[i].amount == 0) || (purchase.payments[i].amount=='')|| (purchase.payments[i].amount==null)){
						purchase.payments[i].amount = 0
						zeroPayments += 1;
					}
				}

				if (zeroPayments<purchase.payments.length){

					var newPurchase = new Purchase(purchase);
					newPurchase.$save(function(p, resp) {
						if(!p.error) {
							// If there is no error, redirect to the main view
							$location.path('purchase');
						} else {
							alert('Could not create purchase');
						}
					});

				}else{
					for (var i=0; i< purchase.payments.length;i++){
						if (purchase.payments[i].amount == 0){
							purchase.payments[i].amount = ''
						}
					}
					alert('You must enter at least one non zero amount.');
				}
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