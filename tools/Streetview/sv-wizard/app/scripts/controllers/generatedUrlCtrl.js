var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.GeneratedUrlCtrl = (function(){
  
  /**
   * GeneratedUrlCtrl controls a simple dialog to show and open the generated
   * StreetView request. Note that this controller can only be used in a dialog 
   * opened using <a href="https://github.com/likeastore/ngDialog">ngDialog</a> 
   * as it relies on the properties and functions inserted by this utility on 
   * the scope.
   * <br/><br/>
   * The request URL has to be pased upon the dialog creation in the data
   * object with the <tt>url</tt> key
   * @constructor
   * @param {Scope} $scope <b>Injected</b>
   * @param {window} $window <b>Injected</b>: Angular wrapper around the 
   *  browser's window object
   * @memberOf svWizard.controllers
   */
  var GeneratedUrlCtrl = function($scope, $window) {
    
    /**
     * Street View request URL
     * @type {string}
     */
    this.url = $scope.ngDialogData.url;
    
    this.window_ = $window;
  };
  
  /**
   * Opens the Street View request in a new browser window
   * @method
   */
  GeneratedUrlCtrl.prototype.open = function() {
    this.window_.open(this.url);
  };
  
  return GeneratedUrlCtrl;
})();

angular.module('svWizardApp').controller( 'GeneratedUrlCtrl',['$scope', 
  '$window', svWizard.controllers.GeneratedUrlCtrl]);
