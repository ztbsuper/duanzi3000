'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
    .module('clientApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/publish', {
                templateUrl: 'views/publish.html',
                controller: 'publishCtrl'
            })
            .when('/collection/:collectionid', {
                templateUrl: 'views/collection.html',
                controller: 'collectionCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
