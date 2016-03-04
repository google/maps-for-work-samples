var svWizard = svWizard || {};
svWizard.services = svWizard.services || {};

svWizard.services.Settings = (function(){
  /**
   * The Settings service is used to store and retrieve the configuration of the
   * application using the browser's local storage. Its properties are 
   * automatically saved from local storage upon change.
   * <br/>
   * It is included in the angular app module as <b>Settings</b> service and needs 
   * no configuration
   * @constructor
   * @param {localStorageService} localStorageService <b>Injected</b>
   * @memberOf svWizard.services
   */  
  var Settings = function(localStorageService) {
    
    var API_KEY = 'apikey';
    var CRYPTO_KEY = 'cryptokey';
    var CLIENT_ID = 'clientid';
    
    var apiKey_ = '';
    var cryptoKey_ = '';
    var clientId_ = '';
    
    loadSetings_();
    
    /**
     * The API key used to authenticate the requests
     * @member {string} apiKey
     * @memberOf svWizard.services.Settings
     */
    Object.defineProperty(this, 'apiKey', {
      get: function() {return apiKey_;},
      set: function(apiKey) {
        apiKey_ = apiKey;
        localStorageService.set(API_KEY, apiKey_);
      }
    });
    
    /**
     * The client id used to authenticate the requests of Premium customers.
     * @member {string} clientId
     * @memberOf svWizard.services.Settings
     */
    Object.defineProperty(this, 'clientId', {
      get: function() {return clientId_;},
      set: function(clientId) {
        clientId_ = clientId;
        localStorageService.set(CLIENT_ID, clientId_);
      }
    });
    /**
     * The crypto key to sign the requests of Premium customers.
     * @member {string} cryptoKey
     * @memberOf svWizard.services.Settings
     */
    Object.defineProperty(this, 'cryptoKey', {
      get: function() {return cryptoKey_;},
      set: function(cryptoKey) {
        cryptoKey_ = cryptoKey;
        localStorageService.set(CRYPTO_KEY, cryptoKey_);
      }
    });
    
    /* Loads settings from local storage */
    function loadSetings_() {
      apiKey_ = localStorageService.get(API_KEY);
      cryptoKey_ = localStorageService.get(CRYPTO_KEY);
      clientId_ = localStorageService.get(CLIENT_ID);
    }
  };
  
  return Settings;
})();

angular.module('svWizardApp').service('Settings', ['localStorageService', 
  svWizard.services.Settings
]);