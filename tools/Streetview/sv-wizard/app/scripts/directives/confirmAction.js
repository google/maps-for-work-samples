var svWizard = svWizard || {};
svWizard.directives = svWizard.directives || {};

svWizard.directives.confirmAction = (function(){
  /**
   * The confirmAction (confirm-action) displays a confirmation dialog one the
   * user click into the element it is inserted in. It only executes the action
   * if the user click in the Accept or Yes button.
   * <br/><br/>
   * The action to execute upon confirmation is provided in the attribute 
   * <tt>confirm-action<tt/> and the message to display to the user in the 
   * <tt>confirm-action-message</tt>.
   * @member {Directive} confirmAction
   * @memberOf svWizard.directives
   */
  var confirmAction = function(ngDialog) {
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
            //Display message
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
              //if confirmed by user, execute action. Do nothing otherwise
              action();
            });
          });
        });  
      }
    }
  }
  return confirmAction;
})();

angular.module('svWizardApp').directive( 'confirmAction', [ 'ngDialog',
  svWizard.directives.confirmAction]);
  