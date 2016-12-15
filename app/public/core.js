// author : siraj ghaffar

var hackathonCars = angular.module('hackathonCars', ['ngRoute']);

hackathonCars.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/detail', {
            templateUrl : 'cardetails.html',
            controller  : 'detailController'
        }).
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});


(function() {

    var app = angular.module('hackathonCars', []);
    var carController = function($scope, $http) {
        // get all the makes
        $http.get('https://api.edmunds.com/api/vehicle/v2/makes?state=new&view=basic&fmt=json&api_key=mexvxqeke9qmhhawsfy8j9qd')
            .then(function (response)
            {
                $scope.makes = response.data.makes;
            }, function (error) {
                $scope.error1 = JSON.stringify(error);
            });

        // for selected make - get all the models.
        $scope.getmodels = function(selectedCarModel) {
            console.log(selectedCarModel);
            $http.get('https://api.edmunds.com/api/vehicle/v2/:'+ selectedCarModel +'/models?state=new&view=basic&fmt=json&api_key=mexvxqeke9qmhhawsfy8j9qd')
                .then(function (response)
                {
                    console.log(response.data.models);
                    $scope.models = response.data.models;
                }, function (error) {
                    $scope.error2 = JSON.stringify(error);
                });
        };
    };

    app.controller('carController', ['$scope', '$http', carController]);
})();


function mainController($scope, $http) {

    $scope.formData = {};
    $scope.orderByField = "Make";
    $scope.reverseSort = "false";
    $scope.searchQuery = "";
    $scope.gap = 5;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    $http.get('/api/cars')
        .success(function (data) {
            $scope.cars = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createCar = function () {
        $http.post('/api/cars', $scope.formData)
            .success(function (data) {
                alert("Your car has been posted for sale. Buyers will contact you directly");
                window.location = '/index.html';
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.cars = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // delete a car
    $scope.deleteCar = function (id) {
        $http.delete('/api/cars/' + id)
            .success(function (data) {
                $scope.cars = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.showCarDetails = function (car) {
        console.log("Details...");
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'cardetails.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                yourItem: function () {
                    return car;
                }
            }
        });
    };


hackathonCars.controller('detailController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

}
