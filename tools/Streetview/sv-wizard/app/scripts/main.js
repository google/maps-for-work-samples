var svWizard = svWizard || {};

var svWizardApp = angular.module('svWizardApp', ['ngDialog',
  'ng-polymer-elements', 'LocalStorageModule']);

svWizardApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('svwizard');
});

svWizardApp.run(['$rootScope', function( $rootScope) {
  $rootScope.$on('openmenu', function() {
    angular.element('#drawer').get(0).openDrawer();
  });

  $rootScope.$on('closemenu', function() {
    angular.element('#drawer').get(0).closeDrawer();
  });
}]);
