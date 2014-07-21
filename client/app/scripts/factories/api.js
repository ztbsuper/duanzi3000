var app = angular.module('clientApp');

app.factory('API',['$http',function($http){
    return {
        fetchSets : function(){
            return $http.get('http://127.0.0.1:8080/api/set/');
        }
    }
}]);