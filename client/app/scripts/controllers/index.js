'use strict';
var app = angular.module('clientApp');


app.controller('indexCtrl', function ($scope, $interval, API) {
    $scope.count = 0;
    API.countAllDuanzi().success(function (data, status) {
            $scope.count = data;
        }
    );
});