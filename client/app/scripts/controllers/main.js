'use strict';
var app = angular.module('clientApp');

app.controller('indexCtrl', function ($scope, $interval, API) {
    $scope.count = 0;
    API.countAllDuanzi().success(function (data, status) {
            $scope.count = data;
        }
    );

});
app.controller('MainCtrl', function ($scope, API, loadingService) {
    $scope.collections = [];
    API.fetchCollections().success(function (data, status) {
        $scope.collections = data;
    });
    $scope.isNull = function (str) {
        return str == "";
    };
});

app.controller('headerCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    }
});

app.controller('publishCtrl', function ($scope, $location, API, loadingService, $modal) {
    $scope.placeholder = "直接贴段子，两个回车自动分段";
    $scope.duanzis = [];
    $scope.title = "";
    $scope.author = "";
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
        var loading = $modal.open(loadingService.options);
        console.log(loading);
        API.postCollection(obj)
            .success(function (data, status) {
                loading.close();
                $location.path("/collection/" + data.collectionid);
            })
            .error(function (data, status) {
                loading.close();
            });

    }
});

app.controller('collectionCtrl', function ($scope, $routeParams, $location, $window, API, loadingService, $modal) {
    $scope.duanzis = [];
    $scope.del = [];
    API.fetchDuanzis($routeParams.collectionid)
        .success(function (data, status) {
            $scope.duanzis = data;
        })
        .error(function (data, status) {
            alert("error occurred");
        });
    $scope.removeFromDel = function (index) {
        $scope.duanzis.push($scope.del.splice(index, 1)[0]);
    };
    $scope.removeFromDuanzis = function (index) {
        $scope.del.push($scope.duanzis.splice(index, 1)[0]);
    };
    $scope.thumbsup = function (_id) {
        var loading = $modal.open(loadingService.options);
        API.thumbsup(_id)
            .success(function (data, status) {
                loading.close();
                $window.location.reload();
            })
            .error(function (data, status) {
                loading.close();
                $window.location.reload();
            })
    };
    $scope.thumbsdown = function (_id) {
        var loading = $modal.open(loadingService.options);
        API.thumbsdown(_id)
            .success(function (data, status) {
                loading.close();
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
    }
});
