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
    
    this.getApiKey = function() {
        return apiKey_;
    };
    
    this.getCryptoKey = function() {
        return cryptoKey_;
    };
    
    this.getClientId = function() {
        return clientId_;
    };
    
    this.getSettings = function() {
        return {
            apiKey: apiKey_,
            cryptoKey: cryptoKey_,
            clientId: clientId_
        }
    };
    
    this.setApiKey = function( apiKey) {
        apiKey_ = apiKey;
        localStorageService.set(API_KEY, apiKey_);
    };
    
    this.setCryptoKey = function(cryptoKey) {
        cryptoKey_ = cryptoKey;
        localStorageService.set(CRYPTO_KEY, cryptoKey_);
    };
    
    this.setClientId = function(clientId) {
        clientId_ = clientId;
        localStorageService.set(CLIENT_ID, clientId_);
    }
    
    function loadSetings() {
        console.log('load settings');
        apiKey_ = localStorageService.get(API_KEY);
        cryptoKey_ = localStorageService.get(CRYPTO_KEY);
        clientId_ = localStorageService.get(CLIENT_ID);
    }
    
    loadSetings();
    
}]);