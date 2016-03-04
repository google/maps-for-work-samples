var svWizard = svWizard || {};
svWizard.services = svWizard.services || {};

svWizard.services.Menu = (function(){
  /**
   * The Menu service is used to control the opening and closing of the menu
   * paer-drawer. It has to be configured using the <tt>Menu.Provider</tt> named 
   * <tt>MenuProvider</tt> in angular.
   * @constructor
   * @param {Element} menuElement the paper-drawer element which contains the menu
   * @memberOf svWizard.services
   */
  var Menu = function(menuElement) {
    this.element = menuElement;
  }
  /**
   * Opens the menu
   * @method
   */
  Menu.prototype.open = function(){
    this.element.openDrawer();
  }
  /**
   * Closes the menu
   * @method
   */ 
  Menu.prototype.close = function(){
    this.element.closeDrawer();
  }
  /**
   * Provider to configure the <tt>Menu</tt> service by providin the HTML element
   * where the paper-drawer element is. It can be inserted in 
   * the angular app configuration method with the name 'MenuProvider'.
   * @class
   */
  Menu.Provider = function() {
  
    var menuElement_ = null;
    /**
     * The element provided is used to configure the Menu service to work upon it
     * @method 
     * @param {Element} element the paper-drawer element which contains the menu
     */
    this.setMenuElement = function(element) {
      menuElement_ = element;
    }
    /**
     * Gets an already configured instance of the Menu service
     * @method
     * @returns {svWizard.services.Menu} the configured Menu service
     */
    this.$get = function() {
      return new svWizard.services.Menu(menuElement_);
    }
  };
  return Menu;
})();

angular.module('svWizardApp').provider('Menu', 
  svWizard.services.Menu.Provider);
