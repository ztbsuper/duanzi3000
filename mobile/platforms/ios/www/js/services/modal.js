'use strict';
var app = angular.module('starter');

app.factory('loadingService',  function () {
    return {
        options: {
            templateUrl: 'views/loading.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg'
        }
    };
});

