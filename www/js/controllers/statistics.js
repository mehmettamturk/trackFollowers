(function() {
    trackFollowersApp.controller('StatisticsController', function($rootScope, $scope, Instagram, $ionicActionSheet, API, $timeout) {
        $scope.currentUser = JSON.parse(localStorage.getItem('loggedUser'));
        $scope.statistics = JSON.parse(localStorage.getItem('statistics'));
        $scope.latestPhoto = '';
        $rootScope.showSpinner();
        $scope.followStatus = {};

        Instagram
            .get({id: 'media/recent', access_token: $scope.currentUser.access_token, limit: 1}).$promise
            .then(function(response) {
                $scope.latestPhoto = response.data[0].images.thumbnail.url;

                return API
                    .query({id : 'follow-status', access_token: $scope.currentUser.access_token}).$promise
                    .then(function(response) {
                        $scope.followStatus = response;
                        $timeout(function() {
                            $rootScope.hideSpinner();
                        }, 100);
                    });
            })
            .catch(function(err) {
                console.log('Error occured', JSON.stringify(err));

                API
                    .query({id : 'follow-status', access_token: $scope.currentUser.access_token}).$promise
                    .then(function(response) {
                        $scope.followStatus = response;
                        $rootScope.hideSpinner();
                    })
                    .catch(function(err) {
                        console.log('Error occured', JSON.stringify(err));
                        $rootScope.hideSpinner();
                    })
            });

        $scope.doRefresh = function() {
            Instagram
                .get({ access_token: $scope.currentUser.access_token }).$promise
                .then(function(response) {
                    var loggedUser = response.data;
                    loggedUser.access_token = $scope.currentUser.access_token;
                    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

                    var statistics = {
                        'count': {
                            'follows' : loggedUser.counts.follows - $scope.currentUser.counts.follows,
                            'followed_by': loggedUser.counts.followed_by - $scope.currentUser.counts.followed_by
                        },
                        'fetch': Date.now()
                    };

                    localStorage.setItem('statistics', JSON.stringify(statistics));

                    $scope.currentUser = JSON.parse(localStorage.getItem('loggedUser'));
                    $scope.statistics = statistics;
                    $scope.statistics.fetch = Date.now()
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .catch(function(err) {
                    console.log('Error occured', JSON.stringify(err));
                })
        };
    });
})();
