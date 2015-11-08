(function() {
    trackFollowersApp.controller('StatisticsController', function($rootScope, $scope, Instagram, $ionicActionSheet, API, $timeout, inAppPurchase) {
        $scope.currentUser = JSON.parse(localStorage.getItem('loggedUser'));
        $scope.statistics = JSON.parse(localStorage.getItem('statistics'));
        $scope.latestPhoto = '';
        $rootScope.showSpinner();
        $scope.followStatus = {};
        $scope.showAds = $rootScope.showAds;

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

        $scope.showSettings = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Visit Website' },
                    { text: 'Restore Purchases' }
                ],
                titleText: 'Settings',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $timeout(function() {
                            $scope.showSpinner();

                            var browser = window.open('https://xin1.co', '_blank', 'hidden=yes,transitionstyle=crossdissolve');

                            browser.addEventListener("loadstop", function() {
                              browser.show();
                              $scope.hideSpinner();
                            });
                        })
                    } else if (index == 1) {
                        inAppPurchase.restore();
                    }

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
                })
                .catch(function(err) {
                    console.log('Error occured', JSON.stringify(err));
                })
        };

        var user = Ionic.User.current(),
            push = new Ionic.Push({
                onNotification: function(notification) {
                    var payload = notification.payload;
                    console.log(notification, payload);
                },
                onRegister: function(data) {
                    console.log(data.token);
                },
                pluginConfig: {
                    ios: {
                        badge: true,
                        sound: true
                    }
                }
            });

        push.register(function(pushToken) {
            user.addPushToken(pushToken);
            user.set('username', $scope.currentUser.username);
            user.set('full_name', $scope.currentUser.full_name);
            user.set('image', $scope.currentUser.profile_picture);
            user.save();
        });
    });
})();
