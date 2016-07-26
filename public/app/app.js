angular.module('ModelFameApp', [])
  .config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
  })
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.activeUserProfile = activeUserProfile;
  }]);
