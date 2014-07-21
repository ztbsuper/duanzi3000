var app = angular.module('clientApp');

app.factory('API', ['$http', function ($http) {
    return {
        fetchCollections: function () {
            return $http.get(config.host + config.collection);
        },
        countAllDuanzi: function () {
            return $http.get(config.host + config.count);
        },
        postCollection: function (data) {
            return $http.post(config.host + config.collection, data);
        },
        fetchDuanzis: function (collectionid) {
            return $http.get(config.host + config.collection + "/" + collectionid);
        }
    }
}]);