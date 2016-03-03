var svWizard = svWizard || {};
var angular = angular || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('RequestProvider', ['localStorageService',
  function(localStorageService) {
    var REQUESTS = 'requests';

    var requests_ = {};
    var requestsArray_ = []

    init_();

    this.createRequest = function(request) {
      if(request.name === undefined || request.name === null || 
        request.name.length === 0) {
        throw 'Request must have a name';
      }
      
      if(this.getRequestWithName(request.name) !== null) {
        throw 'Name should be unique';
      }
      var id = Math.random().toString(36).substr(2, 9)
      request.id = id;
      request.timestamp = Date.now() + '';
      requests_[id] = request;
      saveRequests_();
      updateArray_();
      return request;
    };
    
    this.updateRequest = function(id, newReq) {
      if(newReq.name === undefined || newReq.name === null || 
        newReq.name.length === 0) {
        throw 'Request must have a name';
      }
      var oldReq = requests_[id];
      
      if(oldReq === undefined || oldReq === null) {
        throw 'Request does not exist';
      }
      newReq.id = id;
      newReq.timestamp = Date.now() + '';
      requests_[id] = newReq;
      
      saveRequests_();
      updateArray_();
      
      return newReq;
    };
    
    this.getRequestWithName = function(name) {
      var request = null;
      if(name !== null && name !== undefined && name != '') {
        for(var id in requests_) {
          if(requests_.hasOwnProperty(id)) {
            if(requests_[id].name === name) {
              request = requests_[id];
              break;
            }
          }
        }  
      }
      
      return request;
    }
    
    Object.defineProperty(this, 'requests', {
      get: function(){return requestsArray_}
    });
    

    this.deleteRequest = function(id) {
      delete requests_[id];
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
    }

    function saveRequests_() {
      var requestsJson = angular.toJson(requests_);
      localStorageService.set(REQUESTS, requestsJson);
    }
    
  }
]);
