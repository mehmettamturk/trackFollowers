(function() {
    trackFollowersApp.controller('AppController', function($scope, $window, $timeout) {
        $scope.logout = function() {
            localStorage.clear();

            $timeout(function() {
                location.reload();
            }, 300);
        };
    });
})();
