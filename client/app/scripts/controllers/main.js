'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */

var app = angular.module('clientApp');
app.controller('headerCtrl', function ($scope,$location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    }
});

app.controller('publishCtrl',function($scope,$location){

});