(function() {
    trackFollowersApp.controller('OldestFriendsController', function($rootScope, $scope, Instagram, $window, $ionicActionSheet, $http) {
        var currentUser = JSON.parse(localStorage.getItem('loggedUser'));

        $scope.users = [];
        $rootScope.showSpinner();

        $scope.getFriends = function() {
            var getIt = function(url) {
                $http
                    .get(url)
                    .then(function(response) {
                        if (!response.data.pagination.next_url) {
                            $scope.users = response.data.data;
                            $rootScope.hideSpinner();
                        } else {
                            getIt(response.data.pagination.next_url);
                        }
                    })
                    .catch(function(e) {
                        console.log('Error', e);
                        $rootScope.hideSpinner();
                    });
            };

            Instagram
                .get({ id: 'followed-by', access_token: currentUser.access_token }).$promise
                .then(function(response) {
                    if (!response.pagination.next_url) {
                        $scope.users = response.data;
                        $rootScope.hideSpinner();
                    } else {
                        getIt(response.pagination.next_url);
                    }
                })
        };

        $scope.getFriends();

        $scope.doRefresh = function() {
            $scope.getFriends();
        };

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
    });
})();
