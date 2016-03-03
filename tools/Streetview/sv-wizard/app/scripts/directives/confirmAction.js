var svWizardApp = angular.module('svWizardApp');

svWizardApp.directive( 'confirmAction', [ 'ngDialog', function(ngDialog) {
  return {
    restrict: 'A',
    scope: {
      confirmAction: '&',
      confirmActionMessage: '@'
    },
    link: function(scope, element, attrs) {
      var action = scope.confirmAction;
      element.bind('click', function(){
        scope.$apply( function(){
          //Display
          var message = scope.confirmActionMessage;
          ngDialog.openConfirm({
            template: 'templates/confirm.html',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            controller: 'ConfirmCtrl',
            controllerAs: 'dialog',
            data: {
              message: message
            }
          }).then(function() {
            action();
          });
        });
      });  
    }
  }
}]);