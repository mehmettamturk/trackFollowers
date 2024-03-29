(function() {
    window.trackFollowersApp = angular.module('trackFollowersApp', [
        'ionic','ionic.service.core',
        'ionic.service.analytics',
        'ngCordovaOauth',
        'ngResource',
        'angularMoment',
        'ngIOS9UIWebViewPatch'
    ]);

    trackFollowersApp
    .run(function($ionicPlatform, $rootScope, $window, Instagram, inAppPurchase, $ionicAnalytics) {
        var storedUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (storedUser) $window.location.assign('#/app/statistics');

        var expirationDate = localStorage.getItem('expirationDate');

        if (expirationDate) {
            if (expirationDate > Date.now()) {
                $rootScope.showAds = false;
            } else {
                $rootScope.showAds = true;
                localStorage.removeItem('expirationDate');
            }
        } else {
            $rootScope.showAds = true;
        }

        $rootScope.followStatus = {};

        $rootScope.showSpinner = function() {
            if (window.ProgressIndicator) ProgressIndicator.showSimple(true)
        };

        $rootScope.hideSpinner = function() {
            if (window.ProgressIndicator) ProgressIndicator.hide();
        };

        $ionicPlatform.ready(function() {
            setTimeout(function() {
                navigator && navigator.splashscreen && navigator.splashscreen.hide();
            }, 100);
            //$ionicAnalytics.register();
            Ionic.io();

            inAppPurchase.initialize();

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }

            if (storedUser) {
                $rootScope.showSpinner();

                return Instagram
                .get({ access_token: storedUser.access_token }).$promise
                .then(function(response) {
                    var loggedUser = response.data;
                    loggedUser.access_token = storedUser.access_token;

                    /**
                     * Set necessary information for Ionic.io
                     */
                    var user = Ionic.User.current();

                    if (!user.id && window.cordova) {
                        user.id = loggedUser.id;
                        user.set('username', loggedUser.username);
                        user.set('full_name', loggedUser.full_name);
                        user.set('image', loggedUser.profile_picture);
                        user.save();
                    }

                    // Calculate changes.
                    if (storedUser && storedUser.counts) {
                        var statistics = {
                            'count': {
                                'follows': (loggedUser.counts.follows - storedUser.counts.follows),
                                'followed_by': (loggedUser.counts.followed_by - storedUser.counts.followed_by)
                            },
                            'fetch': Date.now()
                        };
                    } else {
                        var statistics = {
                            'count': {
                                'follows' : 0,
                                'followed_by': 0
                            },
                            'fetch': Date.now()
                        };
                    }

                    localStorage.setItem('statistics', JSON.stringify(statistics));
                    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

                    $window.location.assign('#/app/statistics');
                })
                .catch(function(err) {
                    console.log('Error', err);
                    $rootScope.hideSpinner();
                })
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('login', {
            url: '/login',
            abstract: false,
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppController'
        })
        .state('app.statistics', {
            url: '/statistics',
            views: {
                'menuContent': {
                    templateUrl: 'templates/statistics.html',
                    controller: 'StatisticsController'
                }
            }
        })
        .state('app.followers', {
            url: '/followers',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followers.html',
                    controller: 'FollowersController'
                }
            }
        })
        .state('app.following', {
            url: '/following',
            views: {
                'menuContent': {
                    templateUrl: 'templates/following.html',
                    controller: 'FollowingController'
                }
            }
        })
        .state('app.differences', {
            url: '/differences',
            views: {
                'menuContent': {
                    templateUrl: 'templates/differences.html',
                    controller: 'DifferencesController'
                }
            }
        })
        .state('app.viewed', {
            url: '/viewed',
            views: {
                'menuContent': {
                    templateUrl: 'templates/viewed.html',
                    controller: 'ViewedController'
                }
            }
        })
        .state('app.most-likes', {
            url: '/most-likes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/most-likes.html',
                    controller: 'MostLikesController'
                }
            }
        })
        .state('app.most-comments', {
            url: '/most-comments',
            views: {
                'menuContent': {
                    templateUrl: 'templates/most-comments.html',
                    controller: 'MostCommentsController'
                }
            }
        })
        .state('app.oldest-friends', {
            url: '/oldest-friends',
            views: {
                'menuContent': {
                    templateUrl: 'templates/oldest-friends.html',
                    controller: 'OldestFriendsController'
                }
            }
        })
        .state('app.followers-not-following-back', {
            url: '/followers-not-following-back',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followersnotfollowingback.html',
                    controller: 'FollowersNotFollowingBackController'
                }
            }
        })
        .state('app.following-not-follow-back', {
            url: '/following-not-follow-back',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followingnotfollowback.html',
                    controller: 'FollowingNotFollowBackController'
                }
            }
        });

        $urlRouterProvider.otherwise('/login');
    });

})();
