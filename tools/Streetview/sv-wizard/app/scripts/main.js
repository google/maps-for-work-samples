var svWizard = svWizard || {};
var svWizardApp = angular.module('svWizardApp', ['ngDialog',
  'ng-polymer-elements', 'LocalStorageModule']);

svWizardApp.config(['localStorageServiceProvider', 'MenuProvider',
  function (localStorageServiceProvider, MenuProvider) {
    localStorageServiceProvider.setPrefix('svwizard');
    MenuProvider.setMenuElement(angular.element('#drawer').get(0));
  }
]);

