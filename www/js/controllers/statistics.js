(function() {
    trackFollowersApp.controller('StatisticsController', function($rootScope, $scope, Instagram, $ionicActionSheet) {
        $scope.currentUser = JSON.parse(localStorage.getItem('loggedUser'));
        $scope.statistics = JSON.parse(localStorage.getItem('statistics'));
        $scope.latestPhoto = '';
        $rootScope.showSpinner();

        Instagram
            .get({id: 'media/recent', access_token: $scope.currentUser.access_token, limit: 1}).$promise
            .then(function(response) {
                $scope.latestPhoto = response.data[0].images.thumbnail.url;
                $rootScope.hideSpinner();
            })
            .catch(function(err) {
                console.log('Error', err);
                $rootScope.hideSpinner();
            });

        $scope.showBuyOptions = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Buy 1 month membership' },
                    { text: 'Buy 3 month membership' },
                    { text: 'Buy 6 month membership' },
                    { text: 'Buy 1 year membership' }
                ],
                titleText: 'All memberships include <b>unlimited tracking</b> and <b>remove ads</b>',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    var options = [1, 3, 6, 12],
                        selected = options[index];

                    return true;
                }
            });
        };

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
