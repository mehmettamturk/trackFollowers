(function() {
    trackFollowersApp.controller('DifferencesController', function($rootScope, $scope, API, $http, $ionicActionSheet, inAppPurchase) {
        var currentUser = JSON.parse(localStorage.getItem('loggedUser'));

        $scope.showAds = $rootScope.showAds;
        $scope.users = [];
        $rootScope.showSpinner();
        $scope.loaded = false;
        $scope.lastDifferenceCheck = localStorage.getItem('lastDifferenceCheck') || Date.now();

        API
            .query({id:'followed-by', access_token: currentUser.access_token}).$promise
            .then(function(response) {
                $rootScope.hideSpinner();
                $scope.users = response.reverse();
                $scope.lastDifferenceCheck = Date.now();
                localStorage.setItem('lastDifferenceCheck', $scope.lastDifferenceCheck);
                $scope.loaded = true;
            })
            .catch(function(err) {
                console.log('Error occured', JSON.stringify(err));
                $rootScope.hideSpinner();
            });

        $scope.doRefresh = function() {
            API
                .query({id:'followed-by', access_token: currentUser.access_token}).$promise
                .then(function(response) {
                    $scope.users = response.reverse();
                    $scope.lastDifferenceCheck = Date.now();
                    localStorage.setItem('lastDifferenceCheck', $scope.lastDifferenceCheck);
                    $scope.loaded = true;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.visitUser = function(username, index) {
            if ($scope.showAds && index < 5) return;
            $scope.showSpinner();

            var browser = window.open('https://instagram.com/' + username, '_blank', 'hidden=yes,transitionstyle=crossdissolve');

            browser.addEventListener("loadstop", function() {
              browser.show();
              $scope.hideSpinner();
            });
        };

        $scope.showBuyOptions = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Buy 1 month membership' },
                    { text: 'Buy 3 month membership' },
                    { text: 'Buy 6 month membership' }
                ],
                titleText: 'All memberships include <b>unlimited tracking</b> and <b>remove ads</b>',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    var options = [1, 3, 6],
                        selected = options[index],
                        purchaseName = '';

                    if (selected == 1) {
                        purchaseName = 'onemonthsubscription'
                    } else if (selected == 3) {
                        purchaseName = 'threemonthsubscription'
                    } else if (selected == 6) {
                        purchaseName = 'sixmonthsubscription';
                    }

                    inAppPurchase.buy(purchaseName);

                    return true;
                }
            });
        };
    });
})();
