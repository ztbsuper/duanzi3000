'use strict';
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
        },
        deleteDuanzis: function (duanzis, code) {
            return $http.post(config.host + config.delduanzi + "/" + code, duanzis);
        },
        thumbsup: function (id) {
            return $http.get(config.host + config.thumbsup + id);
        },
        thumbsdown: function (id) {
            return $http.get(config.host + config.thumbsdown + id);
        },
        rank: function(page){
            return $http.get(config.host + config.rank + page);
        },
        bulk: function(array){
            return $http.post(config.host + config.bulk,array);
        }
    }
}]);