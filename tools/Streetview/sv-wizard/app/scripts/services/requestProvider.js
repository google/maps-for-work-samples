var svWizard = svWizard || {};
var angular = angular || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('RequestProvider', ['localStorageService',
    function(localStorageService) {
    var REQUESTS = 'requests';

    var requests_ = {};
    var requestsArray_ = []

    init_();

    this.saveRequest = function(request) {
      console.log(requests_);
      if( request.timestamp !== null) {
        delete requests_[request.timestamp];
      }
      request.timestamp = Date.now() + '';
      requests_[request.timestamp] = request;
      saveRequests_();
      updateArray_();
      return request;
    }
    
    Object.defineProperty(this, 'requests', {
      get: function(){return requestsArray_}
    });
    

    this.removeRequest = function(timestamp) {
      delete requests_[timestamp];
      saveRequests_();
      updateArray_();
      return true;
    }
    
    //Private
   
    
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
    
    }
]);
