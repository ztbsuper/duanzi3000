'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */

var app = angular.module('clientApp');
app.controller('indexCtrl', function ($scope, API) {
    $scope.count = 0;
    API.countAllDuanzi().success(function (data, status) {
        $scope.count = data;
    });
});
app.controller('MainCtrl', function ($scope, API) {
    $scope.collections = [];
    API.fetchCollections().success(function (data, status) {
        $scope.collections = data;
    });
});
app.controller('headerCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    }
});

app.controller('publishCtrl', function ($scope, API) {
    $scope.placeholder = "直接贴段子，两个回车自动分段";
    $scope.duanzis = [];
    $scope.$watch('contents', function () {
        var separator = new RegExp("\n{2,}");
        if (separator.test($scope.contents)) {
            var result = strip_tags($scope.contents, "<br/>").split(/\n{2,}/g);
            result.forEach(function (e) {
                if (e.trim() != "") {
                    $scope.duanzis.push(e.replace(/\n/g, "<br/>").trim());
                }
            });
            $scope.contents = "";
        }
    });

    $scope.remove = function (index) {
        $scope.duanzis.splice(index, 1);
    };

    $scope.submit = function () {
        if ($scope.duanzis.length <= 0) {
            return;
        }
        var obj = {
            title: $scope.title,
            author: $scope.author,
            duanzis: $scope.duanzis
        };
        API.postCollection(obj)
            .success(function (data, status) {

            })
            .error(function (data, status) {

            });

    }
});

app.controller('collectionCtrl', function ($scope, $routeParams, API) {
    $scope.duanzis=[];
    API.fetchDuanzis($routeParams.collectionid)
        .success(function(data,status){
            $scope.duanzis = data;

        })
        .error(function(data,status){
            alert("error occurred");
        });
});