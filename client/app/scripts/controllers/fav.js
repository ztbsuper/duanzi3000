'use strict';
var app = angular.module('clientApp');

app.controller('favCtrl',function(API,favStorage){
    $scope.duanzis = [];
    API.bulk(favStorage.getFav)
        .success(function(data,status){
            $scope.duanzis = data;
        })
        .error(function(data,status){
            console.log("error");
        });

});