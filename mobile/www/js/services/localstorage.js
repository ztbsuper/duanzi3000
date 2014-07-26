'use strict';
var app = angular.module('starter');

app.factory('thumbs', ['StorageHelper', function (StorageHelper) {
    return{
        thumbUpAvailable: function (duanzi_id) {
            return StorageHelper.getStorageAsArray('thumbup').indexOf(duanzi_id) == -1;
        },
        thumbUp: function (duanzi_id) {
            StorageHelper.pushStorageArrayUniq('thumbup', duanzi_id);
        },
        thumbDownAvailable: function (duanzi_id) {
            return StorageHelper.getStorageAsArray('thumbdown').indexOf(duanzi_id) == -1;
        },
        thumbDown: function (duanzi_id) {
            StorageHelper.pushStorageArrayUniq('thumbdown', duanzi_id);
        }
    };

}]);

app.factory('favStorage', ['StorageHelper', function (StorageHelper) {
    return{
        pushFav: function (duanzi_id) {
            return StorageHelper.pushStorageArrayUniq('fav', duanzi_id);
        },
        getFav: function () {
            return StorageHelper.getStorageAsArray('fav');
        },
        removeFromFav: function (duanzi_id) {
            StorageHelper.removeFromUniqArray('fav', duanzi_id);

        }
    }
}]);


app.service('StorageHelper', function () {
    this.getStorageAsArray = function (key) {
        if (localStorage.getItem(key) == null) {
            return [];
        }
        return JSON.parse(localStorage.getItem(key));
    };
    this.pushStorageArray = function (key, value) {
        var array = localStorage.getItem(key) == null ? [] : JSON.parse(localStorage.getItem(key));
        array.push(value);
        localStorage.setItem(key, JSON.stringify(array));
    };
    this.pushStorageArrayUniq = function (key, value) {
        var array = localStorage.getItem(key) == null ? [] : JSON.parse(localStorage.getItem(key));
        if (array.indexOf(value) == -1) {
            array.push(value);
            localStorage.setItem(key, JSON.stringify(array));
        }
    };
    this.removeFromUniqArray = function (key, value) {
        var array = localStorage.getItem(key) == null ? [] : JSON.parse(localStorage.getItem(key));
        array.splice(array.indexOf(value), 1);
        localStorage.setItem(key, JSON.stringify(array));
    }
});