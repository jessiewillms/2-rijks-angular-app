// module method takes two arguements - artApp + empty array
var app = angular.module('artApp', ['ui.router']);
// app variable used to chain things along
// takes two parems - name of controller + func

app.config(function($stateProvider) {
    $stateProvider
    // state is a method
        .state('index', {
            url: '',
            controller: 'MainCtrl',
            templateUrl: 'js/templates/homepage.html'
        })
        .state('single', {
            url: '/single/:id',
            controller: 'SingleCtrl',
            templateUrl: 'js/templates/singlePage.html'
        });
});

app.controller('MainCtrl', function($scope, art) {
    // .then => after getArt, then DO something
    // takes 2 arguemntes
    art.getArt().then(function(data) {
            
            $scope.artItems = data.artObjects;
        }),
        // error function
        function(err) {
            console.log(err)
        };

    $scope.search = function(e) {
            if (e !== undefined) {
                e.preventDefault();
            }
            // console.log($scope.searchQuery);
            // w/e is typed in the box, sent to the search
            art.searchArt($scope.searchQuery).then(function(data) {
                // .then() = when search is done, then do something
                $scope.artItems = data.artObjects;
            });
            // console.log($scope.artItems);
        }
        // add properties to scope. dependency injection
    // $scope.items = ['hey', 'this', 'is', 'cool'];

});

app.controller('SingleCtrl', function($scope, art, $stateParams) {
	art.getArtById($stateParams.id).then(function(data){
		$scope.artWork = data.artObject;
        console.log(data.artObject)
	});
});

app.directive('artItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/templates/artItem.html'
    }
});

// factory takes two arguements
app.factory('art', function($http, $q) {
    var API = 'DuHVObzL';
    var URL = 'https://www.rijksmuseum.nl/api/en/collection/';
    var APIURL = URL + '?key=' + API;
    return {
        getArt: function() {

            var def = $q.defer();

            $http.get(APIURL)
                // if it works, call resolve function. 
                //resolve = something that is successful
                .success(def.resolve)
                // if fails, run reject function
                .error(def.reject);

            return def.promise;
        },
        // call API + look for what was entered to search
        searchArt: function(query) {
            var def = $q.defer();

            $http.get(APIURL + '&q=' + query)
                .success(def.resolve)
                .error(def.reject);

            return def.promise;
        },
        getArtById: function(id) {
            var def = $q.defer();

            $http.get(URL + id + '?key=' + API)
                .success(def.resolve)
                .error(def.reject);

            return def.promise;
        }
    };
})

