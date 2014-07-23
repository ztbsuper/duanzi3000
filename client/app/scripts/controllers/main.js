'use strict';
var app = angular.module('clientApp');

app.controller('MainCtrl', function ($scope, API, loadingService) {
    $scope.collections = [];
    API.fetchCollections().success(function (data, status) {
        $scope.collections = data;
    });
    $scope.isNull = function (str) {
        return str == "";
    };
});



