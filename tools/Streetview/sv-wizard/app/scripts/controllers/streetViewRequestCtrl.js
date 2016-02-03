var svWizardApp = angular.module('svWizardApp');


svWizardApp.controller( 'StreetViewRequestCtrl', ['$scope', '$rootScope',
  'ngDialog', 'M','Generator', 'Settings', 'RequestProvider',
  function($scope, $rootScope, ngDialog, M, Generator, Settings,
  RequestProvider) {

  $scope.addressSelected = function(address){
    console.log(address);
    if( address !== undefined && address !== null) {
      console.log('Halloo');
      var location = address.geometry.location;
      RequestProvider.current.location.lat = location.lat();
      RequestProvider.current.location.lng = location.lng();
      
    }
  }
  
  $rootScope.$on('openrequest', function(event, request) {
    RequestProvider.current = request;
  });

  $scope.getRatio = function() {
    var width = RequestProvider.current.size.width;
    var height = RequestProvider.current.size.height;

    if( width == 0 || height == 0) {
      return 1;
    }else{
      return width/height;
    }
  };

  $scope.save = function() {
    console.log('Prepare to save');
    RequestProvider.current = RequestProvider.saveRequest(RequestProvider.current);
  }

  $scope.generate = function() {
    var url = Generator.generate(RequestProvider.current, Settings);
    ngDialog.open({
      template: 'templates/generated.html',
      className: 'ngdialog-theme-default ngdialog-theme-custom',
      controller: 'GeneratedDialogCtrl',
      data: {
        url: url
      }
    });
  }

  $scope.openMenu = function() {
    $rootScope.$emit('openmenu');
    console.log('Hallo');
  }

  $scope.new = function() {
    RequestProvider.current = angular.copy(RequestProvider.current);
    RequestProvider.current = null;
    RequestProvider.current  = '';
  }
  $scope.AuthenticationMode = M.AuthenticationMode;
  $scope.provider = RequestProvider;
}]);
