
function PurchaseListCtrl($scope, Purchase) {

	

	var metricsSetter = function(){
		var purchases = $scope.purchases;
		
		var sumPurchases = [];
		var totalCost = 0;
		var memberCost = {};

		for (var i in purchases){
			var sum = 0;
			for (var j in purchases[i].payments){
				sum += purchases[i].payments[j].amount
				memberCost[purchases[i].payments[j].name] = 0
			}
			sumPurchases.push(sum)
			totalCost += sum
		}
		
		for (var i in purchases){
			n = purchases[i].payments.length
			portion = sumPurchases[i]/n
			
			for (var j in purchases[i].payments){
				
				
				member = purchases[i].payments[j].name
				memberCost[member] += purchases[i].payments[j].amount - portion  
		
			}
		}
		for (var k in memberCost){
			memberCost[k] = Math.round(memberCost[k]);
		}
		// set metrics
		$scope.memberCost = memberCost
		$scope.totalCost = totalCost;
		$scope.sumPurchases = sumPurchases;

	};
	$scope.purchases = Purchase.query(function(data){
		var purchases = $scope.purchases;
		metricsSetter()
	});

	
	$scope.setBalanceColor = function(v){
		
		if (v < 0)
			return {color: "red"}
		else
			return {color: "green"}
	}
}

function PurchaseItemCtrl($scope, $routeParams, $location, Purchase, Member) {	
	
	var initialPayments = function(){
		var payments = [];
		members = Member.query(function(data){
			for (var i=0; i < data.length;i++){
				payments.push({name: data[i].name, amount: ''})
			}		
			
			
		})


		return payments;
	}

	$scope.purchase = Purchase.get({purchaseId: $routeParams.purchaseId});
	
	// console.log($scope.purchase)
	$scope.removePurchase = function(){
		delPurchase = new Purchase($scope.purchase)
		console.log(delPurchase)
		if (confirm("You are about to DELETE the purchase!!! Are you sure?")){
			delPurchase.$remove({purchaseId: delPurchase._id}, function(p, resp){
				if (!p.error){
					
					// $scope.purchases = $scope.purchases.filter(function(v) {return v._id != purchaseId});
					// metricsSetter();

					$location.path("purchases")
				} else {
					alert('Could not delete purchase');
				}
			})
		}
	}

	$scope.updatePurchase = function(){
		
		purchase = $scope.purchase
		
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
		$scope.purchase.payments = initialPayments()
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
			for (var i=0; i < data.length;i++){
				payments.push({name: data[i].name, amount: ''})
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
function MemberListCtrl($scope, $location, Member, Purchase){

	


	$scope.members = Member.query();

	
	$scope.addMember = function() {
		$scope.members.push({ name: ''});
	};
	$scope.removeMembers = [];

	$scope.updateMembers = function() {
		// 1. post new members
		// 2. update old members
		// 3. delete some members $scope.removeMembers
		members = $scope.members.filter(function(v){return v.name != ""});
		
		
		updateMembers = members.filter(function(v){return v._id})
		postMembers = members.filter(function(v){return !v._id})
		
		// POST new members first
		for (var i =0; i< postMembers.length; i++){
			member = new Member(postMembers[i])

			member.$save(function(p, resp){
				if (!p.error){
					// $location.path('purchases');
				} else {
					alert('Could not update member list')
				}
			})
			
		}

		// UPDATE existed members
		for (var i =0; i< updateMembers.length; i++){
			member = new Member(updateMembers[i])

			member.$update(function(p, resp){
				if (!p.error){
					// $location.path('purchases');
				} else {
					alert('Could not update member list')
				}
			})
			
		}

		// DELETE members from $scope.removeMembers

		for (var i=0;i<$scope.removeMembers.length;i++){

			member = $scope.removeMembers[i];
			member.$remove({_id: member._id}, function(p, resp){
				if (!p.error){
					// $scope.members = $scope.members.filter(function(v){return v.name != memberName})		
				}
			})

		}		

		$scope.removeMember = [];
		$location.path('purchases');
	};
	$scope.removeMember = function(memberName, memberId){

		// here we DO NOT really delete a member
		// just add it to a list in order to delete it where save
		if (memberId){
			// this is an already posted member
			
			var purchases = Purchase.query(function(data){
				
				var found = false;
				for (var i in purchases){
					for (var j in purchases[i].payments){
						if (purchases[i].payments[j].name == memberName){
							found = true;
							break
						}
					}
					if (found){
						break
					
					}
				}

				if (found){
					alert('Could not delete this member. '+memberName+' owns some debts.')
				} else {
					member = new Member({
						name: memberName,
						_id: memberId
					});
					
					// add member to the list for deletion if doesnot exist
					found = false
					for (var i=0;i<$scope.removeMembers.length;i++){
						if (memberId==$scope.removeMembers[i]){
							found = true;
							break;
						}
					}
					// update members list
					if (!found){
						$scope.removeMembers.push(member)
						$scope.members = $scope.members.filter(function(v){return v.name != memberName})
					}

					// member.$remove({_id: memberId}, function(p, resp){
					// 	if (!p.error){
					// 		$scope.members = $scope.members.filter(function(v){return v.name != memberName})		
							
					// 	}
					// })
					// member = new
				}
				

			})
		} else {
			// this is a new member, not in database
			$scope.members = $scope.members.filter(function(v){return v.name != memberName})
		}
	}
	$scope.resetMembers = function(){
		$scope.members = Member.query();
		$scope.removeMembers = [];
	}
}