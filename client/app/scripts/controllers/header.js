'use strict';
var app = angular.module('clientApp');

app.controller('headerCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    }
});
