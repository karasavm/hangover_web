// Angular service module for connecting to JSON APIs
angular.module('purchaseServices', ['ngResource']).
	factory('Purchase', function($resource) {
		return $resource('purchases/:purchaseId', {}, 
		{
			// Use this method for getting a list of polls
			query: { method: 'GET', params: { purchaseId: 'purchases' }, isArray: true },
			update : {method: 'PUT'}
		})
	}).
	factory('Member', function($resource) {
		return $resource('members', {}, {
			// Use this method for getting a list of members
			query: { method: 'GET', isArray: true },
			update : {method: 'PUT'}
		})
	}).
	factory('Transfer', function($resource) {
		return $resource('transfers', {}, {
			// Use this method for getting a list of members
			query: { method: 'GET', isArray: true },
			update : {method: 'PUT'}
		})
	})