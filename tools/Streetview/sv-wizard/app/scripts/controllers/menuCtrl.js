var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.MenuController = function(Settings, RequestProvider, 
  State, Menu) {
  
  this.provider = RequestProvider;
  this.settings = Settings;
  this.state = State;
  this.menu = Menu;
};

svWizard.controllers.MenuController.prototype.openRequest = function(request) {
  this.state.current = request;
  this.menu.close();
};

angular.module('svWizardApp').controller( 'MenuCtrl', ['Settings',
'RequestProvider', 'State', 'Menu', svWizard.controllers.MenuController]);
  
  
/*
svWizardApp.controller( 'MenuCtrl', ['$scope', '$rootScope', 'Settings',
  'RequestProvider', function($scope, $rootScope, Settings, RequestProvider) {
  
  $scope.provider = RequestProvider;
  $scope.settings = Settings;

  $scope.openRequest = function(request) {
    $rootScope.$emit('openrequest', request);
    $rootScope.$emit('closemenu');
  }
}]);
*/