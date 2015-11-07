(function() {
    trackFollowersApp.controller('LoginController', function($rootScope, $scope, $cordovaOauth, Instagram, $window) {
        var randomBackground = Math.floor(Math.random() * Math.random() * 100) % 2;
        $scope.isFirstBackground = randomBackground == 1;

        $scope.credentials = {
            'clientId': '7ab9cac2487b425497608b6b11acab54',
            'clientSecret': 'b9bdac5b752e4e73ad03a840d5ee5c18'
        };

        // Instagram Login in webview.
        $scope.login = function() {
            $cordovaOauth.instagram($scope.credentials.clientId, ['basic', 'likes', 'comments'])
                .then(function(user) {
                    $rootScope.loggedUser = user;
                    localStorage.setItem('loggedUser', JSON.stringify(user));
                    return user;
                })
                .then(function(storedUser) {
                    $rootScope.showSpinner();

                    return Instagram
                        .get({ access_token: storedUser.access_token }).$promise
                        .then(function(response) {
                            var loggedUser = response.data;
                            loggedUser.access_token = storedUser.access_token;
                            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
                            delete loggedUser;

                            var statistics = {
                                'count': {
                                    'follows' : 0,
                                    'followed_by': 0
                                },
                                'fetch': Date.now()
                            };

                            localStorage.setItem('statistics', JSON.stringify(statistics));

                            var user = Ionic.User.current();
                            
                            if (!user.id) {
                                user.id = loggedUser.id;
                                user.set('username', loggedUser.username);
                                user.set('full_name', loggedUser.full_name);
                                user.set('image', loggedUser.profile_picture);
                                user.save();
                            }

                            $rootScope.hideSpinner();
                            $window.location.assign('#/app/statistics');
                        })
                })
                .catch(function(err) {
                    console.log('Error occured', JSON.stringify(err));
                    $rootScope.hideSpinner();
                });
        };
    });
})();
