(function () {
    'use strict';

    describe('Blues Route Tests', function () {
        // Initialize global variables
        var $scope,
            BluesService;

        // We can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function ($rootScope, _BluesService_) {
            // Set a new global scope
            $scope = $rootScope.$new();
            BluesService = _BluesService_;
        }));

        describe('Route Config', function () {
            describe('Main Route', function () {
                var mainstate;
                beforeEach(inject(function ($state) {
                    mainstate = $state.get('blues');
                }));

                it('Should have the correct URL', function () {
                    expect(mainstate.url).toEqual('/blues');
                });

                it('Should be abstract', function () {
                    expect(mainstate.abstract).toBe(true);
                });

                it('Should have template', function () {
                    expect(mainstate.template).toBe('<ui-view></ui-view>');
                });
            });

            describe('View Route', function () {
                var viewstate,
                    BluesController,
                    mockBlue;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    viewstate = $state.get('blues.view');
                    $templateCache.put('modules/blues/client/views/view-blue.client.view.html', '');

                    // create mock Blue
                    mockBlue = new BluesService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Blue Name'
                    });

                    // Initialize Controller
                    BluesController = $controller('BluesController as vm', {
                        $scope: $scope,
                        blueResolve: mockBlue
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(viewstate.url).toEqual('/:blueId');
                });

                it('Should have a resolve function', function () {
                    expect(typeof viewstate.resolve).toEqual('object');
                    expect(typeof viewstate.resolve.blueResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(viewstate, {
                        blueId: 1
                    })).toEqual('/blues/1');
                }));

                it('should attach an Blue to the controller scope', function () {
                    expect($scope.vm.blue._id).toBe(mockBlue._id);
                });

                it('Should not be abstract', function () {
                    expect(viewstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(viewstate.templateUrl).toBe('modules/blues/client/views/view-blue.client.view.html');
                });
            });

            describe('Create Route', function () {
                var createstate,
                    BluesController,
                    mockBlue;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    createstate = $state.get('blues.create');
                    $templateCache.put('modules/blues/client/views/form-blue.client.view.html', '');

                    // create mock Blue
                    mockBlue = new BluesService();

                    // Initialize Controller
                    BluesController = $controller('BluesController as vm', {
                        $scope: $scope,
                        blueResolve: mockBlue
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(createstate.url).toEqual('/create');
                });

                it('Should have a resolve function', function () {
                    expect(typeof createstate.resolve).toEqual('object');
                    expect(typeof createstate.resolve.blueResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(createstate)).toEqual('/blues/create');
                }));

                it('should attach an Blue to the controller scope', function () {
                    expect($scope.vm.blue._id).toBe(mockBlue._id);
                    expect($scope.vm.blue._id).toBe(undefined);
                });

                it('Should not be abstract', function () {
                    expect(createstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(createstate.templateUrl).toBe('modules/blues/client/views/form-blue.client.view.html');
                });
            });

            describe('Edit Route', function () {
                var editstate,
                    BluesController,
                    mockBlue;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    editstate = $state.get('blues.edit');
                    $templateCache.put('modules/blues/client/views/form-blue.client.view.html', '');

                    // create mock Blue
                    mockBlue = new BluesService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Blue Name'
                    });

                    // Initialize Controller
                    BluesController = $controller('BluesController as vm', {
                        $scope: $scope,
                        blueResolve: mockBlue
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(editstate.url).toEqual('/:blueId/edit');
                });

                it('Should have a resolve function', function () {
                    expect(typeof editstate.resolve).toEqual('object');
                    expect(typeof editstate.resolve.blueResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(editstate, {
                        blueId: 1
                    })).toEqual('/blues/1/edit');
                }));

                it('should attach an Blue to the controller scope', function () {
                    expect($scope.vm.blue._id).toBe(mockBlue._id);
                });

                it('Should not be abstract', function () {
                    expect(editstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(editstate.templateUrl).toBe('modules/blues/client/views/form-blue.client.view.html');
                });

                xit('Should go to unauthorized route', function () {

                });
            });

        });
    });
}());
