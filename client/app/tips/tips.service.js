'use strict';

angular.module('SSLSArchApp')
  .factory('tipService', function($http) {
    
    var urlBase = '/api/tips';
    var dataFactory = {};

    dataFactory.getAll = function () {
        return $http.get(urlBase).then(function(tips) {            
            return tips.data;
        });
    };

    dataFactory.getById = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    dataFactory.create = function (tip) {
        return $http.post(urlBase, tip);
    };

    dataFactory.update = function (tip) {
        return $http.put(urlBase + '/' + tip._id, tip);      
    };

    dataFactory.delete = function (tip) {        
        return $http.delete(urlBase + '/' + tip._id );
    };

    return dataFactory;    
  });