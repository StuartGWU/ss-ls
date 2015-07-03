'use strict';

angular.module('SSLSArchApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tips', {
        url: '/tips',
        templateUrl: 'app/tips/tips.html',
        controller: 'TipsCtrl',
        authenticate: false
      });
  });