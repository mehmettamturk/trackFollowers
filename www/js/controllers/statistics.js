(function() {
    trackFollowersApp.controller('StatisticsController', function($rootScope, $scope, Instagram, $ionicActionSheet, $ImageCacheFactory, $timeout) {
        $scope.currentUser = JSON.parse(localStorage.getItem('loggedUser'));
        $scope.statistics = JSON.parse(localStorage.getItem('statistics'));
        $scope.latestPhoto = '';
        $rootScope.showSpinner();

        Instagram
            .get({id: 'media/recent', access_token: $scope.currentUser.access_token, limit: 1}).$promise
            .then(function(response) {
                $scope.latestPhoto = response.data[0].images.thumbnail.url;

                var imageCached = false;
                    $ImageCacheFactory.Cache([
                        $scope.latestPhoto + '',
                        $scope.currentUser.profile_picture + ''
                    ])
                    .then(function() {
                        imageCached = true;
                        $rootScope.hideSpinner();
                    }, function(a) {
                        imageCached = true;
                        $rootScope.hideSpinner();
                    });

                $timeout(function() {
                    if (!imageCached) $rootScope.hideSpinner();
                }, 3000);
            })
            .catch(function(err) {
                console.log('Error', err);
                $rootScope.hideSpinner();
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
                });
        };
    });
})();
