// Blues service used to communicate Blues REST endpoints
(function () {
    'use strict';

    angular
        .module('blues')
        .factory('BluesService', BluesService);

    BluesService.$inject = ['$resource'];

    function BluesService($resource) {
        return $resource('api/blues/:blueId', {
            blueId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
