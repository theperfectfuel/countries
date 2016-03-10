var countriesApp = angular.module('countriesApp', ['ngRoute', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: './home/home.html',
			controller: 'mainCtrl'
		})
		.when('/countries', {
			templateUrl: './countries/countries.html',
			controller: 'countriesCtrl'
		})
		.when('/countries/:country', {
			templateUrl: './capital/capital.html',
			controller: 'capitalsCtrl'
		})
		.otherwise('/home');
	}]);

countriesApp.factory('listRequest', ['$http', function($http) {
        return function() {
            return $http.get('http://api.geonames.org/countryInfo?username=theperfectfuel&type=JSON',{
            	cache: true
            });
        };
}]);

countriesApp.factory('detailRequest', ['$http', function($http) {

	return function(countryCode) {
		return $http({
		    url: 'http://api.geonames.org/countryInfo?username=theperfectfuel&type=JSON', 
		    method: "GET",
		    params: {country: countryCode}
	 	});
	};

}]);

countriesApp.factory('capitalRequest', ['$http', function($http) {

	return function(countryCode, capital) {
		return $http({
		    url: 'http://api.geonames.org/searchJSON', 
		    method: "GET",
		    params: {
		    	country: countryCode,
		    	q: capital,
		    	maxRows: 1,
		    	name_equals: capital,
		    	isNameRequired: true,
		    	type: JSON,
		    	username: 'theperfectfuel'
		    }
	 	});
	};

}]);

countriesApp.factory('neighborRequest', ['$http', function($http) {

	return function(countryCode) {
		return $http({
		    url: 'http://api.geonames.org/neighboursJSON?username=theperfectfuel&type=JSON', 
		    method: "GET",
		    params: {country: countryCode}
	 	});
	};

}]);

countriesApp.controller('mainCtrl', ['$scope', function($scope) {
	$scope.title = "Countries and Capitals";
}]);

countriesApp.controller('countriesCtrl', ['$scope', 'listRequest', function($scope, listRequest) {
	listRequest().success(function(response) {
		$scope.countriesList = response['geonames'];
		console.log($scope.countriesList);
    });

}]);

countriesApp.controller('capitalsCtrl', 
	['$scope', 'detailRequest', 'capitalRequest', 'neighborRequest', '$routeParams', '$route', 
	function($scope, detailRequest, capitalRequest, neighborRequest, $routeParams, $route) {
	
	$scope.countryCode = $routeParams.country;
	$scope.countryData = [];
	$scope.capital = '';

	detailRequest($scope.countryCode).success(function(response) {
		$scope.countryData = response;

		$scope.capital = $scope.countryData.geonames[0].capital;
		$scope.country = $scope.countryData.geonames[0].countryName;
		$scope.population = $scope.countryData.geonames[0].population;
		$scope.continent = $scope.countryData.geonames[0].continent;
		$scope.area = $scope.countryData.geonames[0].areaInSqKm;
		$scope.upcaseCode = angular.uppercase($scope.countryCode);
		$scope.lowcaseCode = angular.lowercase($scope.countryCode);

		capitalRequest($scope.upcaseCode, $scope.capital).success(function(response) {
			$scope.capitalData = response.geonames[0];
			$scope.capitalPopulation = $scope.capitalData.population;
		});

		neighborRequest($scope.upcaseCode).success(function(response) {
			$scope.neighborData = response.geonames;
			console.log($scope.neighborData);
		});


    	$scope.thisFunction();
		
    });

    $scope.thisFunction = function() {
    	console.log($scope.countryData);
    }


    //neighborRequest().success(function(response) {

    //});

}]);







