var svWizardApp = angular.module('svWizardApp');

svWizardApp.controller( 'MenuCtrl', ['$scope', '$rootScope', 'Settings',
  'RequestProvider', function($scope, $rootScope, Settings, RequestProvider) {
  
  $scope.auth = Settings.getSettings();
  console.log($scope.auth);
  $scope.requests = RequestProvider.getRequests();

  $scope.$watch( function() {
    return RequestProvider.getRequests()
  }, function() {
    $scope.requests = RequestProvider.getRequests();
  })

  $scope.$watch('auth.apiKey', function() {
    Settings.setApiKey($scope.auth.apiKey);
  });

  $scope.$watch('auth.clientId', function() {
    Settings.setClientId($scope.auth.clientId);
  });

  $scope.$watch('auth.cryptoKey', function() {
    Settings.setCryptoKey($scope.auth.cryptoKey);
  });

  $scope.openRequest = function(request) {
    console.log('Opening');
    $rootScope.$emit('openrequest', request);
    $rootScope.$emit('closemenu');
  }

}]);
