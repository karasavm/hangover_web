// Angular module, defining routes for the app
angular.module('polls', ['pollServices']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/polls', { templateUrl: 'partials/list.html', controller: PollListCtrl }).
			when('/poll/:pollId', { templateUrl: 'partials/item.html', controller: PollItemCtrl }).
			when('/new', { templateUrl: 'partials/new.html', controller: PollNewCtrl }).

			when('/purchases', { templateUrl: 'partials/listP.html', controller: PurchaseListCtrl }).
			when('/purchase/:purchaseId', { templateUrl: 'partials/itemP.html', controller: PurchaseItemCtrl }).
			when('/newP', { templateUrl: 'partials/newP.html', controller: PurchaseNewCtrl }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/purchases' });
	}]);
	