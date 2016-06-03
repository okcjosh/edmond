(function () {
  'use strict';

  angular
        .module('blues')
        .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
        // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Blues',
      state: 'blues',
      type: 'dropdown',
      roles: ['*']
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'blues', {
      title: 'List Blues',
      state: 'blues.list'
    });

        // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'blues', {
      title: 'Create Blue',
      state: 'blues.create',
      roles: ['cop']
    });
  }
}());
