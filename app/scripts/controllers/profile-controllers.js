'use strict';

(function() {
  angular.module('ncsaas')
    .controller('DetailUpdateProfileController', [
      'baseUserDetailUpdateController',
      'usersService',
      'ENV',
      '$stateParams',
      DetailUpdateProfileController
    ]);

  function DetailUpdateProfileController(
    baseUserDetailUpdateController,
    usersService,
    ENV,
    $stateParams) {
    var controllerScope = this;
    var Controller = baseUserDetailUpdateController.extend({
      init:function() {
        this.controllerScope = controllerScope;
        this._super();
        this.detailsState = 'profile.details';
        this.showImport = ENV.showImport;
        this.tab = $stateParams.tab;
      },
      activate: function() {
        var vm = this;
        usersService.getCurrentUser().then(function(response) {
          vm.model = response;
        });
      }
    });

    controllerScope.__proto__ = new Controller();
  }
})();

(function() {
  angular.module('ncsaas').filter('titleCase', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  })
})();

(function() {
  angular.module('ncsaas')
    .controller('HookListController', [
      'baseControllerListClass',
      'hooksService',
      'ENTITYLISTFIELDTYPES',
      HookListController
    ]);

  function HookListController(
    baseControllerListClass,
    hooksService,
    ENTITYLISTFIELDTYPES) {
    var controllerScope = this;
    var Controller = baseControllerListClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this.service = hooksService;
        this._super();

        this.actionButtonsListItems = [
          {
            title: 'Remove',
            clickFunction: this.remove.bind(this.controllerScope),
            className: 'remove'
          }
        ];

        this.entityOptions = {
          entityData: {
            noDataText: 'No notifications yet',
            createLink: 'profile.hook-create',
            createLinkText: 'Create notification method',
          },
          list: [
            {
              type: ENTITYLISTFIELDTYPES.statusCircle,
              propertyName: 'is_active',
              onlineStatus: true
            },
            {
              name: 'Notification method',
              propertyName: '$type',
              link: 'profile.hook-details({type: entity.$type, uuid: entity.uuid})',
              type: ENTITYLISTFIELDTYPES.name
            }
          ]
        };
      }
    });

    controllerScope.__proto__ = new Controller();
  }
})();


(function() {
  angular.module('ncsaas')
    .controller('HookCreateController', [
      'baseControllerAddClass',
      'hooksService',
      'eventRegistry',
      '$state',
      HookCreateController
    ]);

  function HookCreateController(
    baseControllerAddClass,
    hooksService,
    eventRegistry,
    $state) {
    var controllerScope = this;
    var Controller = baseControllerAddClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this.service = hooksService;
        this._super();
        this.fillRows();
        this.instance.$type = 'email';
      },

      fillRows: function() {
        var vm = this;
        this.rows = eventRegistry.entities.map(function(entity) {
          return {
            id: entity,
            selected: false
          }
        });
      },

      getEntities: function() {
        var entities = [];
        for (var i = 0; i < this.rows.length; i++) {
          var row = this.rows[i];
          if (row.selected) {
            entities.push(row.id);
          }
        }
        return entities;
      },

      save:function() {
        var vm = this;
        vm.instance.event_types = eventRegistry.entities_to_types(this.getEntities());
        vm.instance.$save(success, error);
        function success() {
          vm.successFlash(vm.getSuccessMessage());
          this.gotoList();
        }
        function error(response) {
          vm.errors = response.data;
          vm.onError();
        }
      },

      getSuccessMessage: function() {
        return 'Notification has been created';
      },

      cancel: function() {
        this.gotoList();
      },

      gotoList: function() {
        $state.go('profile.details', {'tab': 'notifications'});
      }
    });

    controllerScope.__proto__ = new Controller();
  }
})();

(function() {
  angular.module('ncsaas')
    .controller('HookUpdateController', [
      'baseControllerDetailUpdateClass',
      'hooksService',
      'eventRegistry',
      '$state',
      '$stateParams',
      HookUpdateController
    ]);

  function HookUpdateController(
    baseControllerDetailUpdateClass,
    hooksService,
    eventRegistry,
    $state,
    $stateParams) {
    var controllerScope = this;
    var Controller = baseControllerDetailUpdateClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this.service = hooksService;
        this._super();
      },

      activate: function() {
        var vm = this;
        hooksService.$get($stateParams.type, $stateParams.uuid).then(function(response) {
          vm.model = response;
          vm.fillRows();
        }, function() {
          $state.go('errorPage.notFound');
        });
      },

      fillRows: function() {
        var entities = eventRegistry.types_to_entities(this.model.event_types);
        this.rows = eventRegistry.entities.map(function(entity) {
          return {
            id: entity,
            selected: entities.indexOf(entity) != -1
          }
        });
      },

      getEntities: function() {
        var entities = [];
        for (var i = 0; i < this.rows.length; i++) {
          var row = this.rows[i];
          if (row.selected) {
            entities.push(row.id);
          }
        }
        return entities;
      },

      update: function() {
        this.model.event_types = eventRegistry.entities_to_types(this.getEntities());
        var vm = this;
        vm.model.$update(success, error);
        function success() {
          vm.gotoList();
        }
        function error(response) {
          vm.errors = response.data;
        }
      },

      cancel: function() {
        this.gotoList();
      },

      gotoList: function() {
        $state.go('profile.details', {'tab': 'notifications'});
      }
    });

    controllerScope.__proto__ = new Controller();
  }
})();
