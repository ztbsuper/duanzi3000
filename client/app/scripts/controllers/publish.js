'use strict';
var app = angular.module('clientApp');

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
        API.postCollection(obj)
            .success(function (data, status) {
                loading.close();
                $location.path("/collection/" + data.collectionid);
            })
            .error(function (data, status) {
                loading.close();
            });

    };
});