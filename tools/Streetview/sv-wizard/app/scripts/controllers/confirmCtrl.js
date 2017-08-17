var svWizard = svWizard || {};

svWizard.controllers = svWizard.controllers || {};
 
svWizard.controllers.ConfirmCtrl = (function(){
  /**
   * CofirmController controls a simple dialog to confirm or decline an 
   * action. Note that this controller can only be used in a dialog opened using 
   * <a href="https://github.com/likeastore/ngDialog">ngDialog</a> as it relies
   * on the properties and functions inserted by this utility on the scope.
   * <br/><br/>
   * The message to display has to be pased upon the dialog creation in the data
   * object with the <tt>message</tt> key
   * @constructor
   * @param {Scope} $scope <b>Injected</b> 
   * @memberOf svWizard.controllers 
   */
  var ConfirmCtrl = function($scope) {
    /**
     * Closes the dialog confirming the action.
     * @method
     */ 
    this.confirm = $scope.confirm;
    /**
     * Closes the dialog canceling the action.
     * @method
     */ 
    this.cancel = $scope.closeThisDialog;
    /**
     * The message to display in the dialog
     * @type {string}
     */ 
    this.message = $scope.ngDialogData.message;
  };
  
  return ConfirmCtrl;
})();

angular.module('svWizardApp').controller( 'ConfirmCtrl',['$scope', 
  svWizard.controllers.ConfirmCtrl]);
