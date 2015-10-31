(function() {
    angular.module('trackFollowersApp').factory('Instagram', function($resource) {
        var root_api = 'https://api.instagram.com/v1/users/self/';

        return $resource(
            root_api + ':id',
            { id: '@id' }
        )
    });
})();
