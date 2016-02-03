var svWizard = svWizard || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('Settings', ['localStorageService', 
  function(localStorageService) {
    
  var API_KEY = 'apikey';
  var CRYPTO_KEY = 'cryptokey';
  var CLIENT_ID = 'clientid';
  
  var apiKey_ = '';
  var cryptoKey_ = '';
  var clientId_ = '';
  
  Object.defineProperty(this, 'apiKey', {
    get: function() {return apiKey_;},
    set: function(apiKey) {
      apiKey_ = apiKey;
      localStorageService.set(API_KEY, apiKey_);
    }
  });
  
  Object.defineProperty(this, 'clientId', {
    get: function() {return clientId_;},
    set: function(clientId) {
      clientId_ = clientId;
      localStorageService.set(CLIENT_ID, clientId_);
    }
  });
  Object.defineProperty(this, 'cryptoKey', {
    get: function() {return cryptoKey_;},
    set: function(cryptoKey) {
      cryptoKey_ = cryptoKey;
      localStorageService.set(CRYPTO_KEY, cryptoKey_);
    }
  });
  
  function loadSetings_() {
    apiKey_ = localStorageService.get(API_KEY);
    cryptoKey_ = localStorageService.get(CRYPTO_KEY);
    clientId_ = localStorageService.get(CLIENT_ID);
  }
  
  loadSetings_();
    
}]);