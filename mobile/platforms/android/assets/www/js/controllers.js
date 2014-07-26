'use strict';
var app = angular.module('starter.controllers', []);


app.controller('rankCtrl',function($scope,API){
    var page = 1;
    API.rank(page).
        success(function(data,status){
            $scope.duanzis = data;
        })
});
app.controller('favCtrl',function($scope){});
app.controller('publishCtrl',function($scope){});
