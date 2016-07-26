angular.module('ModelFameApp', ['ui.bootstrap', 'ui.bootstrap.tpls'])
  .config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
  })
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.activeUserProfile = activeUserProfile;
  }]);
