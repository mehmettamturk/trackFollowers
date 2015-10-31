(function() {
    angular.module('trackFollowersApp').factory('API', function($resource) {
        var root_api = 'https://track-followers.herokuapp.com/';

        return $resource(
            root_api + ':id',
            { id: '@id' }
        )
    });
})();
