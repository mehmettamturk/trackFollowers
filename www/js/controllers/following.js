(function() {
    trackFollowersApp.controller('FollowingController', function($rootScope, $scope, Instagram, API, $http) {
        $scope.users = [];
        $rootScope.showSpinner();

        var currentUser = JSON.parse(localStorage.getItem('loggedUser')),
            loadMoreUrl = null;

        Instagram
            .get({id: 'follows', access_token: currentUser.access_token}).$promise
            .then(function(response) {
                $scope.users = response.data;
                loadMoreUrl = response.pagination.next_url;
                $rootScope.hideSpinner();
            })
            .catch(function(err) {
                console.log('Error occured', JSON.stringify(err));
                $rootScope.hideSpinner();
            });

        $scope.doRefresh = function() {
            Instagram
                .get({id: 'follows', access_token: currentUser.access_token}).$promise
                .then(function(response) {
                    $scope.users = response.data;
                    loadMoreUrl = response.pagination.next_url;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.loadMore = function() {
            if (loadMoreUrl)
                $http.get(loadMoreUrl).success(function(items) {
                    $scope.users = $scope.users.concat(items.data);
                    loadMoreUrl = items.pagination.next_url;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        $scope.isScrollAvailable = function() {
            return $scope.users && loadMoreUrl;
        };

        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });
    });
})();
