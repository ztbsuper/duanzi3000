'use strict';
var app = angular.module('clientApp');


app.controller('rankCtrl', function ($scope, API, loadingService, $modal, thumbs, favStorage, $location, adminStorage, lastReading) {
    $scope.lastReading = lastReading.getLastReadingPage();

    $scope.page = 0;
    $scope.loading = false;
    $scope.isAdmin = adminStorage.isAdmin();
    API.countAllDuanzi()
        .success(function (data, status) {
            $scope.count = data;
        });

    $scope.duanzis = [];
    $scope.del = [];
    $scope.fetchDuanzis = function () {
        $scope.loading = true;
        $scope.page = parseInt($scope.page) + 1;
        if ($scope.page > 1) {
            lastReading.setReadingPage($scope.page)
        }
        API.rank($scope.page)
            .success(function (data, status) {
                data.forEach(function (e) {
                    $scope.duanzis.push(e);
                    $scope.loading = false;
                });
            })
            .error(function (data, status) {
                console.log("error");
            });
    };

    $scope.thumbup = function (_id, index) {
        API.thumbsup(_id)
            .success(function (data, status) {
                $scope.duanzis[index].thumbsup = $scope.duanzis[index].thumbsup + 1;
                thumbs.thumbUp(_id);
            })
            .error(function (data, status) {
            });
    };
    $scope.thumbdown = function (_id) {
        $scope.loading = true;
        API.thumbsdown(_id)
            .success(function (data, status) {
                $scope.duanzis[index].thumbsdown = $scope.duanzis[index].thumbsdown + 1;
                thumbs.thumbDown(_id);
            })
            .error(function (data, status) {
            });
    };
    $scope.removeFromDel = function (index) {
        $scope.duanzis.push($scope.del.splice(index, 1)[0]);
    };
    $scope.removeFromDuanzis = function (index) {
        $scope.del.push($scope.duanzis.splice(index, 1)[0]);
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
    $scope.readLast = function () {
        $scope.page = $scope.lastReading;
        $scope.duanzis = [];
        $scope.count = $scope.count - ($scope.page - 1) * 10;
        $scope.fetchDuanzis();
    };
    $scope.cleanLast = function () {
        lastReading.cleanReadingPage();
        $scope.lastReading = null;
    };

});