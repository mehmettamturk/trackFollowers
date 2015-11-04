(function() {
    trackFollowersApp.controller('MostLikesController', function($rootScope, $scope, API, $window, $ionicActionSheet) {
        var currentUser = JSON.parse(localStorage.getItem('loggedUser'));

        $scope.users = [];
        $rootScope.showSpinner();

        API
            .query({id:'most-likes', access_token: currentUser.access_token}).$promise
            .then(function(response) {
                $rootScope.hideSpinner();
                $scope.users = response.slice(0, 20);
            })
            .catch(function(err) {
                console.log('Error occured', JSON.stringify(err));
                $rootScope.hideSpinner();
            });

        $scope.doRefresh = function() {
            API
                .query({id:'most-likes', access_token: currentUser.access_token}).$promise
                .then(function(response) {
                    $scope.users = response.slice(0, 20);
                    $scope.$broadcast('scroll.refreshComplete');
                });
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
