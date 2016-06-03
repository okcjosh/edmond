(function () {
    'use strict';

    angular
        .module('blues')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('blues', {
                abstract: true,
                url: '/blues',
                template: '<ui-view></ui-view>'
            })
            .state('blues.list', {
                url: '',
                templateUrl: 'modules/blues/client/views/list-blues.client.view.html',
                controller: 'BluesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Blues List'
                }
            })
            .state('blues.create', {
                url: '/create',
                templateUrl: 'modules/blues/client/views/form-blue.client.view.html',
                controller: 'BluesController',
                controllerAs: 'vm',
                resolve: {
                    blueResolve: newBlue
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Blues Create'
                }
            })
            .state('blues.edit', {
                url: '/:blueId/edit',
                templateUrl: 'modules/blues/client/views/form-blue.client.view.html',
                controller: 'BluesController',
                controllerAs: 'vm',
                resolve: {
                    blueResolve: getBlue
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Edit Blue {{ blueResolve.name }}'
                }
            })
            .state('blues.view', {
                url: '/:blueId',
                templateUrl: 'modules/blues/client/views/view-blue.client.view.html',
                controller: 'BluesController',
                controllerAs: 'vm',
                resolve: {
                    blueResolve: getBlue
                },
                data: {
                    pageTitle: 'Blue {{ articleResolve.name }}'
                }
            });
    }

    getBlue.$inject = ['$stateParams', 'BluesService'];

    function getBlue($stateParams, BluesService) {
        return BluesService.get({
            blueId: $stateParams.blueId
        }).$promise;
    }

    newBlue.$inject = ['BluesService'];

    function newBlue(BluesService) {
        return new BluesService();
    }
}());
