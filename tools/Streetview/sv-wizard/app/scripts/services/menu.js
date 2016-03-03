var svWizard = svWizard || {};
svWizard.services = svWizard.services || {};

svWizard.services.MenuProvider = function() {
  
  var menuElement_ = null;
  
  this.setMenuElement = function(element) {
    menuElement_ = element;
  }
  
  this.$get = function() {
    return new svWizard.services.Menu(menuElement_);
  }
};

svWizard.services.Menu = function(menuElement_) {
  this.element = menuElement_;
}

svWizard.services.Menu.prototype.open = function(){
  this.element.openDrawer();
}

svWizard.services.Menu.prototype.close = function(){
  this.element.closeDrawer();
}

angular.module('svWizardApp').provider('Menu', 
  svWizard.services.MenuProvider);
