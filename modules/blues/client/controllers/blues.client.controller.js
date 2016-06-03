(function () {
  'use strict';

    // Blues controller
  angular
        .module('blues')
        .controller('BluesController', BluesController);

  BluesController.$inject = ['$scope', '$state', 'Authentication', 'blueResolve'];

  function BluesController($scope, $state, Authentication, blue) {
    var vm = this;

    vm.authentication = Authentication;
    vm.blue = blue;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

        // Remove existing Blue
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.blue.$remove($state.go('blues.list'));
      }
    }

        // Save Blue
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blueForm');
        return false;
      }

            // TODO: move create/update logic to service
      if (vm.blue._id) {
        vm.blue.$update(successCallback, errorCallback);
      } else {
        vm.blue.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('blues.view', {
          blueId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
