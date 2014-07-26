'use strict';
var app = angular.module('starter.controllers', []);


app.controller('rankCtrl', function ($scope, API, favStorage) {
    $scope.page = 1;
    $scope.predicate = " -thumbsup";
    API.countAllDuanzi()
        .success(function (data, status) {
            $scope.count = data;
        });
    API.rank($scope.page)
        .success(function (data, status) {
            $scope.duanzis = data;
        })
        .error(function (data, status) {
        });
    $scope.fetchDuanzis = function () {
        $scope.page = $scope.page + 1;
        API.rank($scope.page)
            .success(function (data, status) {
                data.forEach(function (e) {
                    $scope.duanzis.push(e);
                });
            })
            .error(function (data, status) {
                console.log("error");
            });
    };
    $scope.favAvailable = function (_id) {
        return favStorage.getFav().indexOf(_id) == -1;
    };
    $scope.pushFav = function (_id) {
        favStorage.pushFav(_id);

    };
    $scope.removeFromFav = function (_id) {
        favStorage.removeFromFav(_id);

    };
});
app.controller('favCtrl', function ($scope, API, favStorage, $window) {
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
app.controller('publishCtrl', function ($scope, $location) {
    $scope.loading = false;
    $scope.submit = function () {
        $scope.loading = true;
        console.log($scope.author);
        if ($scope.content.length == 0) {
            $scope.loading = false;
        } else {
            var content = strip_tags($scope.content, "<br/>").trim();
            var obj = {
                title: $scope.title,
                author: $scope.author,
                duanzis: content
            };
            API.postCollection(obj)
                .success(function (data, status) {
                    loading.close();
                    $location.path("/rank");
                })
                .error(function (data, status) {
                    loading.close();
                });
        }
    }
});
