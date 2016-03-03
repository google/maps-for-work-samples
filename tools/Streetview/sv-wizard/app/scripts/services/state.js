var svWizard = svWizard || {};
var angular = angular || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('State', ['localStorageService', 'M',
  function(localStorageService, M) {
    var CURRENT = 'current';
    var current_ = {};
    
    init_();

    Object.defineProperty(this, 'current', {
      get: function(){
        if(angular.isUndefined(current_.size) ||
        angular.isUndefined(current_.location) ||
        angular.isUndefined(current_.heading) ||
        angular.isUndefined(current_.fov) ||
        angular.isUndefined(current_.pitch)) {
          current_ = angular.copy(defaultRequest_);
        }
        return current_;
      },
      set: function(request){
        current_ = request;
        this.saveCurrentRequest();
      }
    });

    /*Loads the requests from locastorage*/
     
    var defaultRequest_ = {
      timestamp: null,
      name: null,
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
    
    function init_() {
      var rawCurrent = localStorageService.get(CURRENT);
      if(angular.isDefined(rawCurrent) && rawCurrent !== null &&
        rawCurrent.length > 0) {
        current_ = angular.fromJson(rawCurrent);
      }else{
        current_ = {};
      }
    }

    this.saveCurrentRequest = function(){
      var currentJson = angular.toJson(current_);
      localStorageService.set(CURRENT, currentJson);
    }
    
  }
]);
