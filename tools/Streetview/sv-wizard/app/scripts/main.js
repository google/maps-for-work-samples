/**
 * @namespace
 */ 
var svWizard = svWizard || {
  /**
   * @memberOf svWizard
   * @namespace
   */ 
  services: {},
  /**
   * @memberOf svWizard
   * @namespace
   */ 
  controllers: {},
  /**
   * @memberOf svWizard
   * @namespace
   */ 
  models: {},
  /**
   * @memberOf svWizard
   * @namespace
   */ 
  directives: {},
  
  /**
   * Google Maps APIs domain
   * @constant
   * @memberOf svWizard
   * @inner
   * @type {string}
   * @default
   */
  DOMAIN: 'https://maps.googleapis.com',
  
  /**
   * Google Maps Street View API base URL
   * @constant
   * @memberOf svWizard
   * @inner
   * @type {string}
   * @default
   */
  BASE_URL: '/maps/api/streetview'
};

var svWizardApp = angular.module('svWizardApp', ['ngDialog',
  'ng-polymer-elements', 'LocalStorageModule']);

svWizardApp.config(['localStorageServiceProvider', 'MenuProvider',
  function (localStorageServiceProvider, MenuProvider) {
    localStorageServiceProvider.setPrefix('svwizard');
    MenuProvider.setMenuElement(angular.element('#drawer').get(0));
  }
]);
