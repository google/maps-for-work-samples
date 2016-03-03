var svWizard = svWizard || {};

svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.Confirm = function($scope) {
  this.scope = $scope;
  this.message = $scope.ngDialogData.message;
};

svWizard.controllers.Confirm.prototype.accept = function() {
  this.scope.confirm();
};

svWizard.controllers.Confirm.prototype.cancel = function() {
  this.scope.closeThisDialog();
};

angular.module('svWizardApp').controller( 'ConfirmCtrl',['$scope', 
  svWizard.controllers.Confirm]);
