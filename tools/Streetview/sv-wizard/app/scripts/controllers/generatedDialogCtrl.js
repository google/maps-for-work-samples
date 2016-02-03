var svWizardApp = angular.module('svWizardApp');

svWizardApp.controller( 'GeneratedDialogCtrl',
  ['$scope', '$window', function($scope, $window) {

  $scope.url = $scope.ngDialogData.url;

  $scope.copy = function() {
    //TODO copy url into clipboard
  };

  $scope.open = function() {
    $window.open($scope.url);
  };
}]);
