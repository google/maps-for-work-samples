var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.SaveCtrl = (function(){
  
  /**
   * SaveCtrl controls the dialog used to save the current request. It shows an
   * input field so the user can enter or modify the name of the requests. If
   * the request is new and has never been saved before (it doesn't have an id),
   * the user will only be able to "Save As" the request, which will create a
   * new one with a new id. However, if the request is already been saved before
   * (have an id) the user will be able to choose between "Save", which may
   * change the request name but keep the same id, or "Save As", which will 
   * create a new request with a new id.
   * <br/><br/>
   * Note that this controller can only be used in a dialog opened using 
   * <a href="https://github.com/likeastore/ngDialog">ngDialog</a> as it relies
   * on the properties and functions inserted by this utility on the scope.
   * <br/><br/>
   * The request to save has to be pased upon the dialog creation in the data
   * object with the <tt>request</tt> key. Once the request is saved, it will 
   * be returned in the close dialog promise.
   * @constructor
   * @param {Scope} $scope <b>Injected</b>
   * @param {svWizard.services.RequestProvider} requestProvider <b>Injected</b>
   * @memberOf svWizard.controllers
   */
  var SaveCtrl = function($scope, requestProvider) {
    /**
     * Closes the dialog when the request is saved
     * @method
     */
    this.confirm = $scope.confirm;
    
    /**
     * @type {svWizard.services.RequestProvider}
     */
    this.requestProvider = requestProvider;
    
    /**
     * A copy of the current request provided in the dialog creation
     * @type {svWizard.models.Request}
     */
    this.request = angular.copy($scope.ngDialogData.request);
  };
  
  /**
   * Saves the request and closes the dialog returning the saved request to the
   * promise. It doesn't create a new request but rather updates an already 
   * existing one
   * @method
   */
  SaveCtrl.prototype.saveRequest = function() {
    this.request = this.requestProvider.
      updateRequest(this.request.id, this.request);
    this.confirm(this.request);
  };
  
  /**
   * Creates a new request and closes the dialog returning the saved request to 
   * the promise.
   * @method
   */
  SaveCtrl.prototype.saveRequestAs = function() {
    this.request = this.requestProvider.createRequest(this.request);
    this.confirm(this.request);
  };
  return SaveCtrl;
})();

angular.module('svWizardApp').controller( 'SaveCtrl',['$scope', 
  'RequestProvider', svWizard.controllers.SaveCtrl]);
