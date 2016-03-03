var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.MenuController = function(Settings, RequestProvider, 
  State, Menu) {
  
  this.provider = RequestProvider;
  this.settings = Settings;
  this.state = State;
  this.menu = Menu;
  this.messages = {
    confirmDelete: 'Do you really want to delete this request? Note that ' +
      'this action cannot be undone'
  }
};

svWizard.controllers.MenuController.prototype.openRequest = function(request) {
  this.state.current = angular.copy(request);
  this.menu.close();
};

svWizard.controllers.MenuController.prototype.deleteRequest = function(request){
  this.provider.deleteRequest(request.id);
  if(this.state.current.id === request.id) {
    this.state.current.id = null;
    this.state.current.name = '';
  }
}

angular.module('svWizardApp').controller( 'MenuCtrl', ['Settings',
'RequestProvider', 'State', 'Menu', svWizard.controllers.MenuController]);
  