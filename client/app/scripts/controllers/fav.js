'use strict';
var app = angular.module('clientApp');

app.controller('favCtrl', function ($scope, API, favStorage, $window, $timeout) {
    $scope.duanzis = [];
    API.bulk(favStorage.getFav())
        .success(function (data, status) {
            $scope.duanzis = data;
        })
        .error(function (data, status) {
            console.log("error");
        });

    $scope.removeFromFav = function (_id) {
        favStorage.removeFromFav(_id);
        $window.location.reload();
    };

});