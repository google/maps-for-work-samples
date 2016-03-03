var svWizard = svWizard || {};
svWizard.controllers = svWizard.controllers || {};

svWizard.controllers.Main = function(scope, State, Settings, RequestProvider, 
  Menu, Generator, M, ngDialog) {
  this.state = State;
  this.settings = Settings;
  this.requestProvider = RequestProvider;
  this.menu = Menu;
  this.generator = Generator;
  this.AuthenticationMode = M.AuthenticationMode;
  this.dialog = ngDialog;
  this.messages = {
    confirmNew: 'Do you really want to create a new request? All unsaved ' +
        'changes will be discarded.'
  }
  
  var self = this;
  
  scope.$watch( function() {
    return self.state.current;
  }, function(){
    self.onRequestChange();
  }, true);
  
  scope.$watch( function() {
    return {
      apiKey: self.settings.apiKey,
      cryptoKey: self.settings.cryptoKey,
      clientId: self.settings.clientId
    };
  }, function(){
    self.validateAuth();
  }, true);
  
}

svWizard.controllers.Main.prototype.addressSelected = function(address) {
  if( address !== undefined && address !== null) {
    var location = address.geometry.location;
    this.state.current.location.lat = location.lat();
    this.state.current.location.lng = location.lng();
  }
};

svWizard.controllers.Main.prototype.generate = function() {
  var url = this.generator.generate(this.state.current, this.settings);
  this.dialog.open({
    template: 'templates/generated.html',
    className: 'ngdialog-theme-default ngdialog-theme-custom',
    controller: 'GeneratedUrlCtrl',
    controllerAs: 'generated',
    data: {
      url: url
    }
  });
};

svWizard.controllers.Main.prototype.isForWork = function() {
  return this.state.current.authenticationMode 
    === this.AuthenticationMode.CLIENT_AND_CRYPTO;
}

svWizard.controllers.Main.prototype.isFree = function() {
  return this.state.current.authenticationMode 
    === this.AuthenticationMode.NONE;
}

svWizard.controllers.Main.prototype.isApiKey = function() {
  return this.state.current.authenticationMode 
    === this.AuthenticationMode.API_KEY;
}

svWizard.controllers.Main.prototype.validateAuth = function() {
  var mode = this.state.current.authenticationMode;
  this.authenticationMissing = true;
  
  if(mode === this.AuthenticationMode.NONE){
    this.authenticationMissing = false;
  }else if(mode === this.AuthenticationMode.API_KEY && this.settings.apiKey
    && this.settings.apiKey.length > 0) {
    this.authenticationMissing = false;
  }else if(mode === this.AuthenticationMode.CLIENT_AND_CRYPTO
    && this.settings.cryptoKey && this.settings.cryptoKey.length > 0
    && this.settings.clientId && this.settings.clientId.length > 0) {
    this.authenticationMissing = false;    
  } 
};

svWizard.controllers.Main.prototype.onRequestChange = function(){
  this.validateAuth();
  this.state.saveCurrentRequest();
}

svWizard.controllers.Main.prototype.save = function() {
  var self = this;
  this.dialog.openConfirm({
    template: 'templates/save.html',
    className: 'ngdialog-theme-default ngdialog-theme-custom',
    controller: 'SaveCtrl',
    controllerAs: 'save',
    data: {
      request: this.state.current
    }
  }).then( function(saved) {
    self.state.current = angular.copy(saved);
  });
}

svWizard.controllers.Main.prototype.new = function() {
  this.state.current.id = null;
  this.state.current.name  = '';
};

angular.module('svWizardApp').controller( 'MainCtrl', ['$scope', 'State', 
'Settings', 'RequestProvider', 'Menu', 'Generator', 'M', 'ngDialog',
  svWizard.controllers.Main]);
