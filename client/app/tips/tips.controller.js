'use strict';

angular.module('SSLSArchApp')
  .controller('TipsCtrl', function ($scope, $http, socket, Auth, tipService) {
    $scope.tips = [];
    $scope.selectedTip = null;
    $scope.alert = {show: false, msg: '', type: 'success'};
    $scope.isLoggedIn = Auth.isLoggedIn();

    function init() {
    	$scope.tips = tipService.getAll().then(function(tips) {
	    	$scope.tips = tips;            
	       socket.syncUpdates('tip', $scope.tips);
	    });    
    }

    function addTip() {
      if($scope.newTip === '') {
        	return;
      }
      tipService.create($scope.newTip).then(function() {
        $scope.alert.msg = 'Tip [' + $scope.newTip.message + '] has been created';
        $scope.alert.show = true;        
        $scope.alert.type = 'success';
        $scope.newTip = '';
      });
      
    }

    function updateTip() {
      if(!$scope.selectedTip) {
          return;
      }
      tipService.update($scope.selectedTip).then(function() {
        $scope.alert.msg = 'Tip [' + $scope.selectedTip.message + '] has been updated';
        $scope.alert.show = true;        
        $scope.alert.type = 'success';
        $scope.selectedTip = null;
      });
    }

    function deleteTip(tip) {
      $scope.alert.msg = 'Tip [' + tip.message + '] has been deleted';
      tipService.delete(tip).then(function() {
        $scope.alert.show = true;
        $scope.alert.type = 'danger';  
        $scope.selectedTip = null;   
      });
    }

    function selectTip(tip) {
      $scope.selectedTip = tip;
    }
   
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('tip');
    });

    $scope.closeAlert = function() {
      $scope.alert.show = false;
    };

    $scope.addTip = addTip;
    $scope.deleteTip = deleteTip;
    $scope.selectTip = selectTip;
    $scope.updateTip = updateTip;
    
    init();
  });
