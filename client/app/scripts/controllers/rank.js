'use strict';
var app = angular.module('clientApp');


app.controller('rankCtrl', function ($scope, API, loadingService, $modal, thumbs, favStorage, $location, $window) {
    $scope.page = 1;
    API.countAllDuanzi()
        .success(function (data, status) {
            $scope.count = data;
        });
    API.rank($scope.page)
        .success(function (data, status) {
            $scope.duanzis = data;
        })
        .error(function (data, status) {
            console.log("error");
        });
    $scope.fetchDuanzis = function () {
        $scope.page = $scope.page + 1;
        API.rank($scope.page)
            .success(function (data, status) {
                data.forEach(function(e){
                    $scope.duanzis.push(e);
                });
            })
            .error(function (data, status) {
                console.log("error");
            });
    };

    $scope.thumbup = function (_id) {
        var loading = $modal.open(loadingService.options);

        API.thumbsup(_id)
            .success(function (data, status) {
                loading.close();
                thumbs.thumbUp(_id);
                $window.location.reload();
            })
            .error(function (data, status) {
                loading.close();
                $window.location.reload();
            })
    };
    $scope.thumbdown = function (_id) {
        var loading = $modal.open(loadingService.options);

        API.thumbsdown(_id)
            .success(function (data, status) {
                loading.close();
                thumbs.thumbDown(_id);
                $window.location.reload();
            })
            .error(function (data, status) {
                loading.close();
                $window.location.reload();
            })
    };
    $scope.remove = function () {
        API.deleteDuanzis($scope.del, $scope.cheatCode)
            .success(function (data, status) {
                $location.path("/")
            })
            .error(function (data, status) {
                console.log(data);
            });
    };
    $scope.thumbUpAvailable = function (duanzi_id) {
        return thumbs.thumbUpAvailable(duanzi_id);
    };
    $scope.thumbDownAvailable = function (duanzi_id) {
        return thumbs.thumbDownAvailable(duanzi_id);
    };
    $scope.predicate = " -thumbsup";

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