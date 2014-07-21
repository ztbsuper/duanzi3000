'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */

var app = angular.module('clientApp');
app.controller('MainCtrl', function ($scope,API) {
    $scope.sets=[];
    var bindVals = function(data,status){
        $scope.sets = data;
    };
     API.fetchSets().success(bindVals);
});
app.controller('headerCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    }
});

app.controller('publishCtrl', function ($scope) {
    $scope.placeholder = "直接贴段子，两个回车自动分段";
    $scope.duanzis = [];
    $scope.$watch('contents', function () {
        var separator = new RegExp("\n{2,}");
        if (separator.test($scope.contents)) {
            var result = strip_tags($scope.contents).split(/\n{2,}/g);
            result.forEach(function (e) {
                if (e.trim() != "") {
                    $scope.duanzis.push(e.trim());
                }
            });
            $scope.contents = "";
            console.log($scope.duanzis);
        }
    });

    $scope.remove = function(index){
        $scope.duanzis.splice(index,1);
    };

    $scope.submit = function(){
        if($scope.duanzis.length <=0){
            return;
        }

    }
});