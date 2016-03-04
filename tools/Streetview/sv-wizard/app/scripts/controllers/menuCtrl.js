var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.MenuCtrl = (function(){
  /**
   * MenuCtrl controls the side menu on the application. There are two sections
   * in the menu:
   * <br/>
   * <ul>
   *  <li><b>Settings</b>: the user can configure the authentication 
   *    credentials. These are obtained from the <tt>Settings</tt> service
   *  </li>
   *  <li><b>Saved requests</b>: the user can see the list of saved requests,
   *    open and delete them, and filter them by name using the search input.
   *    The operations on the saved requests are done using the 
   *    <tt>RequestProvider</tt> service
   *  </li>
   * </ul>
   * @constructor
   * @param {svWizard.services.Settings} settings <b>Injected</b>
   * @param {svWizard.services.RequestProvider} requestProvier <b>Injected</b>
   * @param {svWizard.services.State} State <b>Injected</b>
   * @param {svWizard.services.Menu} Menu <b>Injected</b>
   * @memberOf svWizard.controllers
   */
  var MenuCtrl = function(settings, requestProvider, 
    state, menu) {
    
    /**
     * @type {svWizard.services.RequestProvider}
     */
    this.provider = requestProvider;
    /**
     * @type {svWizard.services.Settings}
     */
    this.settings = settings;
    /**
     * @type {svWizard.services.State}
     */
    this.state = state;
    
    /**
     * @type {svWizard.services.Menu}
     */
    this.menu = menu;    
    
    /**
     * String to filter the saved URLs with
     * @type {string}
     */
    this.search = '';
    
    /**
     * List of messages needed in the view
     * @type {Object}
     */
    this.messages = {
      /**
       * Message to display in the delete-request confirmation dialog
       * @type {string}
       * @default
       */
      confirmDelete: 'Do you really want to delete this request? Note that ' +
        'this action cannot be undone'
    }
  };
  
  /**
   * Opens a saved request so it is displayed on the main view of the 
   * application. It does it by just copying the saved request into the current
   * request.
   * @method
   * @param {svWizard.models.Request} request the request to open
   */
  MenuCtrl.prototype.openRequest = function(request) {
    this.state.current = angular.copy(request);
    this.menu.close();
  };
  
  /**
   * Deletes a saved request from localstorage and, in case it is the current
   * request, it makes it new by removing its id and name. This is only called
   * after user's confirmation.
   * @method
   * @param {svWizard.models.Request} request the request to open
   */
  MenuCtrl.prototype.deleteRequest = function(request){
    this.provider.deleteRequest(request.id);
    if(this.state.current.id === request.id) {
      this.state.current.id = null;
      this.state.current.name = '';
    }
  }
  return MenuCtrl;
})();


angular.module('svWizardApp').controller( 'MenuCtrl', ['Settings',
'RequestProvider', 'State', 'Menu', svWizard.controllers.MenuCtrl]);
  