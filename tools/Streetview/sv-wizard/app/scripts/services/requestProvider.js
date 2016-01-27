var svWizard = svWizard || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.service('RequestProvider', ['localStorageService',
    function(localStorageService) {
    var REQUESTS = 'requests';
    var CURRENT = 'current';

    var requests_ = {};
    var requestsArray_ = []
    var current_ = {};

    init_();

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
    this.saveRequest = function(request) {
      console.log(requests_);
      var timestamp = request.timestamp;
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

    this.getRequests = function() {
      return requestsArray_;
    }

    this.getCurrentRequest = function(){
      if(angular.isUndefined(current_.size) ||
        angular.isUndefined(current_.location) ||
        angular.isUndefined(current_.heading) ||
        angular.isUndefined(current_.fov) ||
        angular.isUndefined(current_.pitch)) {
          return null;
        }
      return current_;
    }

    this.removeRequest = function(timestamp) {
      delete requests_[timestamp];
      saveRequests_();
      updateArray_();
      return true;
    }

    this.updateCurrentRequest = function(request) {
      current_ = request;
      var currentJson = angular.toJson(current_);
      localStorageService.set(CURRENT, currentJson);
    }



    }
]);
