(function() {
    angular.module('trackFollowersApp').service('inAppPurchase', function($resource) {
        var IAP = {
            initialize: function() {
                if (!window.storekit) {
                    console.log('In-App Purchases not available');
                    return;
                }

                // Initialize
                storekit.init({
                    debug:    true,
                    ready:    IAP.onReady,
                    purchase: IAP.onPurchase,
                    finish:   IAP.onFinish,
                    restore:  IAP.onRestore,
                    error:    IAP.onError,
                    restoreCompleted: IAP.onRestoreCompleted
                });
            },
            onReady: function() {
                storekit.load([
                    'onemonthsubscription',
                    'threemonthsubscription',
                    'sixmonthsubscription'
                ], function (products, invalidIds) {
                    console.log('IAPs loading done:');
                    for (var j = 0; j < products.length; ++j) {
                        var p = products[j];
                        console.log('Loaded IAP(' + j + '). title:' + p.title +
                                    ' description:' + p.description +
                                    ' price:' + p.price +
                                    ' id:' + p.id);
                    }
                });
            },
            onPurchase: function() {
                var localStorage = window.localStorage;

                var n = (localStorage['storekit.' + productId]|0) + 1;
                localStorage['storekit.' + productId] = n;
                if (IAP.purchaseCallback) {
                    IAP.purchaseCallback(productId);
                    delete IAP.purchaseCallback;
                }

                storekit.finish(transactionId);

                storekit.loadReceipts(function (receipts) {
                    console.log('Receipt for appStore = ' + receipts.appStoreReceipt);
                    console.log('Receipt for ' + productId + ' = ' + receipts.forProduct(productId));
                });
            },
            onFinish: function(transactionId, productId) {
                console.log('Finished transaction for ' + productId + ' : ' + transactionId);
            },
            onError: function (errorCode, errorMessage) {
                navigator.notification.alert('Error: ' + errorMessage, null, 'Track Followers', 'Dismiss');
            },
            onRestore: function (transactionId, productId) {
                console.log("Restored: " + productId);
                var n = (localStorage['storekit.' + productId]|0) + 1;
                localStorage['storekit.' + productId] = n;
            },
            onRestoreCompleted: function () {
                navigator.notification.alert('Restore completed.', null, 'Track Followers', 'Dismiss');
                console.log("Restore Completed");
            },
            buy: function (productId, callback) {
                IAP.purchaseCallback = callback;
                storekit.purchase(productId);
            },
            restore: function () {
                storekit.restore();
            },
            fullVersion: function () {
                return localStorage['storekit.babygooinapp1'];
            }
        };

        return IAP;
    });
})();
