(function() {
    trackFollowersApp.controller('AppController', function($scope, $window, $timeout) {
        $scope.logout = function() {
            localStorage.clear();

            $timeout(function() {
                $window.location.assign('#/app/login');
            }, 300);
        };
    });
})();
