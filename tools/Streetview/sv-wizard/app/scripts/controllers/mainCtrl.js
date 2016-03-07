var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.MainCtrl = (function(){
  /**
   * MainCtrl controls the main view of the application, where the user can edit
   * the different parameters using the form and also using the Street View 
   * panorama viewer. The parameters modified by any of these ways will be 
   * reflected in the other, as they both modify the <tt>current</tt> request.
   * When this parameters are modified, the <tt>State</tt> service is used to
   * save the changes into local storage.
   * <br/><br/>
   * This controller also handles generating the request URL and displaying it 
   * to the user in a dialog, saving the requests and creating new ones.
   * @constructor
   * @param {Scope} scope <b>Injected</b>
   * @param {svWizard.services.State} state  <b>Injected</b>
   * @param {svWizard.services.Settings} settings  <b>Injected</b>
   * @param {svWizard.services.Menu} menu  <b>Injected</b>
   * @param {svWizard.services.Utils} utils  <b>Injected</b>
   * @param {ngDialog} ngDialog  <b>Injected</b>
   * @memberOf svWizard.controllers
   */
  var MainCtrl = function(scope, state, settings, menu, utils, ngDialog) {
      
    /**
     * The application's state
     * @type {svWizard.services.State}
     */
    this.state = state;
    
    /**
     * The application's settings
     * @type {svWizard.services.Settings}
     */
    this.settings = settings;
    
    /**
     * The Menu service used to open and close the side menu
     * @type {svWizard.services.Menu}
     */
    this.menu = menu;
    
    /**
     * @type {svWizard.models.AuthenticationMode}
     */
    this.AuthenticationMode = svWizard.models.AuthenticationMode;
    
    /**
     * List of messages needed in the view
     * @type {Object}
     */
    this.messages = {
      /**
       * Message to display in the new-request confirmation dialog
       * @type {string}
       * @default
       */
      confirmNew: 'Do you really want to create a new request? All unsaved ' +
          'changes will be discarded.'
    };
    
    /**
     * Flag that indicates whether the user is missing to provide the needed
     * authentication credentials for the selected authentication method. It is 
     * used in the view to display an error message.
     * @type {boolean}
     */
    this.authenticationMissing = false;
    
    /**
     * The request generator
     * @private
     * @type {svWizard.services.utils.generator}
     **/
    this.generator_ = utils.generator;
    
    /**
     * ngDialog service to create pop-up dialogs
     * @private
     * @type {ngDialog}
     **/
    this.ngDialog_ = ngDialog;
    
    var self = this;
    
    // If any of the properties of the current request changes, onRequestChange
    // is called, which saves the changes into local storage and validates the
    // authentication
    scope.$watch( function() {
      return self.state.current;
    }, function(){
      self.onRequestChange();
    }, true);
    
    // If the authentication settings change, the authentication is checked 
    // to check if there is anything missing and display a message accordingly
    scope.$watch( function() {
      return {
        apiKey: self.settings.apiKey,
        cryptoKey: self.settings.cryptoKey,
        clientId: self.settings.clientId
      };
    }, function(){
      self.validateAuth();
    }, true);
  }
  
  /**
   * It updates the current request location to the one of the provided address.
   * <br/><br/>
   * This function has to be used within the autocomplete directive, so it is
   * called when the user selects and address.
   * @param {google.maps.places.PlaceResult} address the selected address on 
   *  the autocomplete input
   * @method
   */ 
  MainCtrl.prototype.addressSelected = function(address) {
    if( address !== undefined && address !== null) {
      var location = address.geometry.location;
      this.state.current.location.lat = location.lat();
      this.state.current.location.lng = location.lng();
    }
  };
  
  /**
   * Generates a Street View request URL based on the current request parameters
   * and opens the GeneratedDialog to display it
   * @method
   */
  MainCtrl.prototype.generate = function() {
    var url = this.generator_.generate(this.state.current, this.settings);
    this.ngDialog_.open({
      template: 'templates/generated.html',
      className: 'ngdialog-theme-default ngdialog-theme-custom',
      controller: 'GeneratedUrlCtrl',
      controllerAs: 'generated',
      data: {
        url: url
      }
    });
  };
  
  
  /**
   * Checks whether the current request is configured to use for Work or
   * Premium Plan, which means using client id and crypto key to authenticate it
   * @returns {boolean}
   * @method
   */
  MainCtrl.prototype.isForWork = function() {
    return this.state.current.authenticationMode 
      === this.AuthenticationMode.CLIENT_AND_CRYPTO;
  }
  
  /**
   * Checks whether the current request is configured to use the free version, 
   * which means not using any authentication method
   * @returns {boolean}
   * @method
   */
  MainCtrl.prototype.isFree = function() {
    return this.state.current.authenticationMode 
      === this.AuthenticationMode.NONE;
  }
  
  /**
   * Checks whether the current request is configured to use an API key to
   * authenticate the request
   * @returns {boolean}
   * @method
   */
  MainCtrl.prototype.isApiKey = function() {
    return this.state.current.authenticationMode 
      === this.AuthenticationMode.API_KEY;
  }
  
  /**
   * Checks if the user has provided the needed authentication credentials in
   * the settings page for the selected authentication method, and updates the
   * <tt>authenticationMissing</tt> flag accodingly. Should be called everytime
   * the current request authentication method or the authentication settings 
   * change.
   * @method
   */
  MainCtrl.prototype.validateAuth = function() {
    var mode = this.state.current.authenticationMode;
    this.authenticationMissing = true;
    
    if(mode === this.AuthenticationMode.NONE){
      this.authenticationMissing = false;
    }else if(mode === this.AuthenticationMode.API_KEY && this.settings.apiKey
      && this.settings.apiKey.length > 0) {
      this.authenticationMissing = false;
    }else if(mode === this.AuthenticationMode.CLIENT_AND_CRYPTO
      && this.settings.cryptoKey && this.settings.cryptoKey.length > 0
      && this.settings.clientId && this.settings.clientId.length > 0) {
      this.authenticationMissing = false;    
    } 
  };
  
  /**
   * Saves the current request in localstorage using the <tt>State</tt> service
   * and validates the authentication using <tt>validateAuth</tt>.
   * <br/><br/>
   * It should be called everytime some parameter on the current request
   * chages.
   * @method
   */
  MainCtrl.prototype.onRequestChange = function(){
    this.validateAuth();
    this.state.saveCurrentRequest();
  }
  
  /**
   * Opens the save dialog so the user can change the name of the request or
   * save it as a new request. It will update the current request with the saved
   * one, which will contain a new id if it's been newly created and a new 
   * timestamp.
   * @method
   */
  MainCtrl.prototype.save = function() {
    var self = this;
    this.ngDialog_.openConfirm({
      template: 'templates/save.html',
      className: 'ngdialog-theme-default ngdialog-theme-custom',
      controller: 'SaveCtrl',
      controllerAs: 'save',
      data: {
        request: this.state.current
      }
    }).then( function(saved) {
      self.state.current = angular.copy(saved);
    });
  }
  
  /**
   * Creates a new request. Note that in the View, this function is called using
   * the <tt>confirmAction</tt> directive, which means that it won't be executed
   * when the user clicks the new button, but rather when the users confirms
   * the action in the dialog that will be prompted. The parameters of the 
   * new request will remain the same as they were, but it will have no id nor 
   * name.
   * @method
   */
  MainCtrl.prototype.newRequest = function() {
    this.state.current.id = null;
    this.state.current.name  = '';
  };
  return MainCtrl;
})();

angular.module('svWizardApp').controller( 'MainCtrl', ['$scope', 'State', 
'Settings', 'Menu', 'Utils', 'ngDialog',
  svWizard.controllers.MainCtrl]);
