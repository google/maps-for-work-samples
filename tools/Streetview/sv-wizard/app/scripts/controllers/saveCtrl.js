var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.Save = function($scope, RequestProvider) {
  this.scope = $scope;
  this.requestProvider = RequestProvider;
  this.request = angular.copy($scope.ngDialogData.request);
  
};

svWizard.controllers.Save.prototype.saveRequest = function() {
  this.request = this.requestProvider.
    updateRequest(this.request.id, this.request);
  
  this.scope.confirm(this.request);
};


svWizard.controllers.Save.prototype.saveRequestAs = function() {
  this.request = this.requestProvider.createRequest(this.request);
  this.scope.confirm(this.request);
};

angular.module('svWizardApp').controller( 'SaveCtrl',['$scope', 
  'RequestProvider', svWizard.controllers.Save]);
