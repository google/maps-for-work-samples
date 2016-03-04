var svWizard = svWizard || {};

svWizard.services = svWizard.services || svWizard;

svWizard.services.RequestProvider = (function(){
  
  /**
   * RequestProvider handles the creation, retrieval, update and deletion of
   * requests into the browser's local storage.
   * * <br/><br/>
   * It is included in the angular app module as <b>RequestProvider</b> service
   * and needs no configuration
   * @constructor
   * @param {localStorageService} localStorageService <b>Injected</b>
   * @memberOf svWizard.services
   */
  var RequestProvider = function(localStorageService) {
    var REQUESTS = 'requests';

    var requests_ = {};
    var requestsArray_ = []
    // Gets the requests from local storage
    init_();
    
    /**
     * The list of saved requests. It gets updated upong any change.
     * @readonly
     * @member {Array.<svWizard.models.Request>} requests
     * @memberOf svWizard.services.RequestProvider.prototype
     */
    Object.defineProperty(this, 'requests', {
      get: function(){return requestsArray_}
    });

    /**
     * It saves a new request into the requests collection and stores it in
     * local storage. It will also update the requests array. Note that the
     * request must have a name and it must be unique.
     * @method
     * @param {svWizard.models.Request} request the request to save
     * @returns {svWizard.models.Request} the created request
     */
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
    
    /**
     * It updates an already existing request in the requests collection and 
     * stores it in local storage. It will also update the requests array.
     * Note that the request must have been saved before and, in case it has a 
     * new name, it must be unique.
     * @method
     * @param {svWizard.models.Request} request the request to save
     * @returns {svWizard.models.Request} the updated request
     */
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
    
    /**
     * Returns the request with the name provided if it exists in the requests
     * collection. It will return <tt>null</tt> otherwise.
     * @method
     * @params {string} name the name of the request to search
     * @return {svWizard.models.Request}
     */
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
    
    /**
     * Deletes the request with the given id and updates the collection in local
     * storage.
     * @method
     * @param {string} id
     */
    this.deleteRequest = function(id) {
      delete requests_[id];
      saveRequests_();
      updateArray_();
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
    /* Pushes the collection items into an array instead of into an object so it
    is easier to use in a view */
    function updateArray_() {
      requestsArray_ = [];
      for(var key in requests_) {
        requestsArray_.push(requests_[key]);
      }
    }
    /* Saves the requests collection into local storage */
    function saveRequests_() {
      var requestsJson = angular.toJson(requests_);
      localStorageService.set(REQUESTS, requestsJson);
    } 
  }
  return RequestProvider;
})();

angular.module('svWizardApp').service('RequestProvider', ['localStorageService',
  svWizard.services.RequestProvider
]);
