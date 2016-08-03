// Angular module, defining routes for the app
angular.module('purchases', ['purchaseServices']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.

			when('/purchases', { templateUrl: 'partials/listP.html', controller: PurchaseListCtrl }).
			when('/purchase/:purchaseId', { templateUrl: 'partials/itemP.html', controller: PurchaseItemCtrl }).
			when('/newP', { templateUrl: 'partials/newP.html', controller: PurchaseNewCtrl }).
			when('/member', { templateUrl: 'partials/members.html', controller: MemberListCtrl }).
			when('/transfer', { templateUrl: 'partials/transfers.html', controller: TransferListCtrl }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/purchases' });
	}]);
	