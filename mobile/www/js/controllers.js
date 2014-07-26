'use strict';
var app = angular.module('starter.controllers', ['ionic']);


app.controller('rankCtrl', function ($scope, API, favStorage, thumbs) {
    $scope.page = 0;
    $scope.duanzis = [];
    $scope.predicate = " -thumbsup";
    $scope.getDuanziHeight = function (id) {
        console.log(id);
        return document.getElementById(id);
    };
    API.countAllDuanzi()
        .success(function (data, status) {
            $scope.count = data;
        });
    $scope.fetchDuanzis = function () {
        $scope.page = $scope.page + 1;
        API.rank($scope.page)
            .success(function (data, status) {
                data.forEach(function (e) {
                    $scope.duanzis.push(e);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
            .error(function (data, status) {
                console.log("error");
            });
    };
    $scope.$on('stateChangeSuccess', function () {
        $scope.fetchDuanzis();
    });
    $scope.favAvailable = function (_id) {
        return favStorage.getFav().indexOf(_id) == -1;
    };
    $scope.pushFav = function (_id) {
        favStorage.pushFav(_id);

    };
    $scope.removeFromFav = function (_id) {
        favStorage.removeFromFav(_id);
    };



    $scope.thumbup = function (_id, index) {
        if (thumbs.thumbUpAvailable(_id) == false) {
            return;
        }
        $scope.duanzis[index].thumbsup = $scope.duanzis[index].thumbsup + 1;
        API.thumbsup(_id)
            .success(function (data, status) {
                thumbs.thumbUp(_id);
            })
            .error(function (data, status) {
                loading.close();
            })
    };
    $scope.thumbdown = function (_id) {
        if (thumbs.thumbDownAvailable(_id)) {
            return;
        }
        $scope.duanzis[index].thumbsdown = $scope.duanzis[index].thumbsdown + 1;

        API.thumbsdown(_id)
            .success(function (data, status) {
                thumbs.thumbDown(_id);
            })
            .error(function (data, status) {
            });
    };


});
app.controller('favCtrl', function ($scope, API, favStorage, $window) {
    $scope.duanzis = [];
    if (favStorage.getFav().length > 0) {
        API.bulk(favStorage.getFav())
            .success(function (data, status) {
                $scope.duanzis = data;
            })
            .error(function (data, status) {
                console.log("error");
            });
    }
    $scope.removeFromFav = function (_id) {
        favStorage.removeFromFav(_id);
        $window.location.reload();
    };
});

app.controller('publishCtrl', function ($scope, $location, API, $ionicModal) {
    $ionicModal.fromTemplateUrl("templates/thanks.html", {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.loading = false;
    $scope.duanzi = {
        title: "", author: "", body: ""
    };
    $scope.submit = function () {
        $scope.loading = true;
        console.log($scope.duanzi.title);
        if ($scope.duanzi.body.length == 0) {
            $scope.loading = false;
        } else {
            var content = [];
            content.push(strip_tags($scope.duanzi.body, "<br/>").trim());
            var obj = {
                title: $scope.duanzi.title,
                author: $scope.duanzi.author,
                duanzis: content
            };
            API.postCollection(obj)
                .success(function (data, status) {
                    $scope.loading = false;
                    $scope.modal.show();
                })
                .error(function (data, status) {
                });

        }
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
        $location.path('/rank');
    }
});
