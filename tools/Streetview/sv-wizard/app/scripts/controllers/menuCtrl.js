var angular = angular || {};
var svWizardApp = angular.module('svWizardApp');

svWizardApp.controller( 'MenuCtrl', ['$scope', '$rootScope', 'Settings',
  'RequestProvider', function($scope, $rootScope, Settings, RequestProvider) {
  
  $scope.provider = RequestProvider;
  $scope.settings = Settings;

  $scope.openRequest = function(request) {
    $rootScope.$emit('openrequest', request);
    $rootScope.$emit('closemenu');
  }
}]);
