(function () {
    'use strict';

    angular
        .module('blues')
        .controller('BluesListController', BluesListController);

    BluesListController.$inject = ['BluesService'];

    function BluesListController(BluesService) {
        var vm = this;

        vm.blues = BluesService.query();
    }
}());
