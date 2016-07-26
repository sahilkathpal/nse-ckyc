angular.module('ModelFameApp')
  .controller('SearchCtrl', ['$scope', '$http', function ($scope, $http) {
    window.s = $scope;
    $scope.users = formatUsers (users);
    $scope.userFollow = userFollow;

    function userFollow (user, status) {
      $http.post('/users/actions/follow/' + user.id, {status: status})
        .then(function (data) {
          var message;
          if (status) {
            $scope.activeUserProfile.following.push(user.id);
            message = 'You have started following ' + user.name;
          } else {
            $scope.activeUserProfile.following.splice($scope.activeUserProfile.following.indexOf(user.id), 1);
            message = 'You have unfollowed ' + user.name;
          }
          user.followed = status;
          toastr.success(message);
        })
    }
    function formatUsers (users) {
      users.forEach((user) => {
        user.dp = 'http://graph.facebook.com/' + user.id + '/picture?type=square'
        if ($scope.activeUserProfile.following.indexOf(user.id) >= 0) user.followed = true;
      });
      return users;
    }
  }]);
