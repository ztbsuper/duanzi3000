'use strict';
var app = angular.module('clientApp');

app.factory('loadingService', ['$modal', function ($modal) {
    return {
        options: {
            templateUrl: 'views/loading.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg'
        }
    }
}]);

