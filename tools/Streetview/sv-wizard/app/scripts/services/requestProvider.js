var svWizard = svWizard || {};
var angular = angular || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('RequestProvider', ['localStorageService', 'M',
    function(localStorageService, M) {
    var REQUESTS = 'requests';
    var CURRENT = 'current';

    var requests_ = {};
    var requestsArray_ = []
    var current_ = {};

    init_();

    this.saveRequest = function(request) {
      console.log(requests_);
      if( request.timestamp !== null) {
        delete requests_[request.timestamp];
      }
      request.timestamp = Date.now() + '';
      requests_[request.timestamp] = request;
      console.log(requests_);
      saveRequests_();
      updateArray_();
      return request;
    }
    
    Object.defineProperty(this, 'requests', {
      get: function(){return requestsArray_}
    });
    
    //TODO: Move to State service
    
    Object.defineProperty(this, 'current', {
      get: function(){
        if(angular.isUndefined(current_.size) ||
        angular.isUndefined(current_.location) ||
        angular.isUndefined(current_.heading) ||
        angular.isUndefined(current_.fov) ||
        angular.isUndefined(current_.pitch)) {
          return null;
        }
        return current_;
      },
      set: function(request){
        current_ = request;
        saveCurrentRequest_();
      }
    });

    this.removeRequest = function(timestamp) {
      delete requests_[timestamp];
      saveRequests_();
      updateArray_();
      return true;
    }
    
    //Private
    
    var defaultRequest_ = {
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
    
    /*Loads the requests from locastorage*/
    function init_() {
      var rawRequests = localStorageService.get(REQUESTS);
      if(angular.isDefined(rawRequests) && rawRequests !== null
        && rawRequests.length > 0) {
        requests_ = angular.fromJson(rawRequests);
      }else{
        requests_ = {};
      }
      updateArray_();

      var rawCurrent = localStorageService.get(CURRENT);
      if(angular.isDefined(rawCurrent) && rawCurrent !== null &&
        rawCurrent.length > 0) {
        current_ = angular.fromJson(rawCurrent);
      }else{
        current_ = {};
      }
    }

    function updateArray_() {
      requestsArray_ = [];
      for(var key in requests_) {
        requestsArray_.push(requests_[key]);
      }
      console.log(requestsArray_);
    }

    function saveRequests_() {
      var requestsJson = angular.toJson(requests_);
      localStorageService.set(REQUESTS, requestsJson);
    }
    
    function saveCurrentRequest_(){
      var currentJson = angular.toJson(current_);
      localStorageService.set(CURRENT, currentJson);
    }
    
    }
]);
