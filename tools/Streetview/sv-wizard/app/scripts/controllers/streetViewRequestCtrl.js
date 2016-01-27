var svWizardApp = angular.module('svWizardApp');


svWizardApp.controller( 'StreetViewRequestCtrl', ['$scope', '$rootScope',
  'ngDialog', 'M','Generator', 'Settings', 'RequestProvider',
  function($scope, $rootScope, ngDialog, M, Generator, Settings,
  RequestProvider) {

  var defaultRequest = {
    timestamp: null,
    name: 'La Giralda - Sevilla',
    location: {lat: 37.3863, lng: -5.99205},
    size: {
      width: 640,
      height: 640
    },
    heading: 254.5,
    fov: 71.6,
    pitch: 30.8,
    authenticationMode: M.AuthenticationMode.NONE
  };
  var currentRequest = RequestProvider.getCurrentRequest();

  $scope.$watch( 'request', function() {
    RequestProvider.updateCurrentRequest($scope.request);
  }, true);
  
  $scope.addressSelected = function(address){
    console.log(address);
    if( address !== undefined && address !== null) {
      console.log('Halloo');
      var location = address.geometry.location;
      $scope.request.location.lat = location.lat();
      $scope.request.location.lng = location.lng();
      
    }
    
  }
  $rootScope.$on('openrequest', function(event, request) {
    $scope.request = request;
  });

  $scope.getRatio = function() {
    var width = $scope.request.size.width;
    var height = $scope.request.size.height;

    if( width == 0 || height == 0) {
      return 1;
    }else{
      return width/height;
    }
  };

  $scope.save = function() {
    console.log('Prepare to save');
    $scope.request = RequestProvider.saveRequest($scope.request);
  }

  $scope.generate = function() {
    var url = Generator.generate($scope.request, Settings.getSettings());
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
    $scope.request = angular.copy($scope.request);
    $scope.request.timestamp = null;
    $scope.request.name = '';
  }
  $scope.AuthenticationMode = M.AuthenticationMode;
  $scope.request = currentRequest !== null ? currentRequest :
    angular.copy(defaultRequest);
}]);
