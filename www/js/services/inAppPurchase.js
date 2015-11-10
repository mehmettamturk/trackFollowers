(function() {
    angular.module('trackFollowersApp').service('inAppPurchase', function($rootScope, $timeout) {
        var IAP = {
            initialize: function() {
                if (!window.store) {
                    console.log('In-App Purchases not available');
                    return;
                }

                store.register({
                    id: 'onemonthsubscription',
                    type: store.NON_CONSUMABLE
                });

                store.register({
                    id: 'threemonthsubscription',
                    type: store.NON_CONSUMABLE
                });

                store.register({
                    id: 'sixmonthsubscription',
                    type: store.NON_CONSUMABLE
                });

                store.when('onemonthsubscription')
                    .approved(function(product) {
                        product.finish();
                        $rootScope.hideSpinner();
                        localStorage['expirationDate'] = moment().add('1', 'month').valueOf();
                        console.log('BOUGHT', product.id);
                        location.reload();
                    })
                    .updated(function(product) {
                        if (product.owned) {
                            console.log('RESTORE', product.id);
                            localStorage['expirationDate'] = moment().add('3', 'month').valueOf();
                            location.reload();
                        }
                    })
                    .cancelled(function() {
                        $rootScope.hideSpinner();
                    });

                store.when('threemonthsubscription')
                    .approved(function(product) {
                        product.finish();
                        $rootScope.hideSpinner();
                        localStorage['expirationDate'] = moment().add('3', 'month').valueOf();
                        console.log('BOUGHT', product.id);
                        location.reload();
                    })
                    .updated(function(product) {
                        if (product.owned) {
                            console.log('RESTORE', product.id);
                            localStorage['expirationDate'] = moment().add('3', 'month').valueOf();
                            location.reload();
                        }
                    })
                    .cancelled(function() {
                        $rootScope.hideSpinner();
                    });

                store.when('sixmonthsubscription')
                    .approved(function(product) {
                        product.finish();
                        $rootScope.hideSpinner();
                        localStorage['expirationDate'] = moment().add('6', 'month').valueOf();
                        console.log('BOUGHT', product.id);
                        location.reload();
                    })
                    .updated(function(product) {
                        if (product.owned) {
                            console.log('RESTORE', product.id);
                            localStorage['expirationDate'] = moment().add('6', 'month').valueOf();
                            location.reload();
                        }
                    })
                    .cancelled(function() {
                        $rootScope.hideSpinner();
                    });

                store.error(function(e) {
                    $rootScope.hideSpinner();
                    navigator.notification.alert('[' + e.code + ']: ' + e.message, null, 'Error', 'dismiss');
                });
            },
            buy: function (productId) {
                $rootScope.showSpinner();
                store.order(productId);
            },
            restore: function () {
                store.refresh();
            }
        };

        return IAP;
    });
})();
