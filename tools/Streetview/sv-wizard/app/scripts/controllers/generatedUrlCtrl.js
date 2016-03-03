var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.GeneratedUrl = function($scope, $window) {
  this.window = $window;
  //TODO remove dependencie with scope and ngDialogData
  this.url = $scope.ngDialogData.url;
};

svWizard.controllers.GeneratedUrl.prototype.open = function() {
  this.window.open(this.url);
};

angular.module('svWizardApp').controller( 'GeneratedUrlCtrl',['$scope', 
  '$window', svWizard.controllers.GeneratedUrl]);
